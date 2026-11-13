"""Prepare the supplied tapestry photos for the shop catalogue.

The source PNGs are rough alpha cut-outs: they are slightly rotated and the
alpha edge still carries a soft fringe. This script straightens each textile,
cleans the cut-out edge, and places it on a consistent 4:5 warm-ivory canvas
that matches the product card background.

Run from the project root:
    python3 scripts/prepare-tapestries.py
"""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "design" / "tapestries"
DEST = ROOT / "public" / "assets" / "tapestries" / "catalog"

CANVAS_W, CANVAS_H = 1000, 1250
MARGIN = 0.06
# Matches the image area of the product card (bg-[#eee5d9]).
BACKGROUND = (0xEE, 0xE5, 0xD9)


def deskew(rgb: np.ndarray, alpha: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Rotate the textile so its long edge is vertical."""
    raw = (alpha > 128).astype(np.uint8)
    contours, _ = cv2.findContours(raw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)
    (cx, cy), (rw, rh), angle = cv2.minAreaRect(contour)
    if angle < -45:
        rw, rh = rh, rw
        angle += 90

    matrix = cv2.getRotationMatrix2D((cx, cy), angle, 1)
    size = (rgb.shape[1], rgb.shape[0])
    rgb = cv2.warpAffine(
        rgb,
        matrix,
        size,
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )
    alpha = cv2.warpAffine(
        alpha,
        matrix,
        size,
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0,
    )
    return rgb, alpha


def clean_silhouette(alpha: np.ndarray) -> np.ndarray:
    """Return a solid, slightly inset and feathered silhouette."""
    base = (alpha > 100).astype(np.uint8)
    base = cv2.morphologyEx(
        base,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)),
    )
    contours, _ = cv2.findContours(base, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour = max(contours, key=cv2.contourArea)

    silhouette = np.zeros_like(base)
    cv2.drawContours(silhouette, [contour], -1, 255, -1)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    silhouette = cv2.morphologyEx(silhouette, cv2.MORPH_CLOSE, kernel)
    silhouette = cv2.morphologyEx(silhouette, cv2.MORPH_OPEN, kernel)

    # Drop the soft, semi-transparent fringe left by the original cut-out.
    silhouette = cv2.erode(
        silhouette, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    )
    return cv2.GaussianBlur(silhouette, (0, 0), 1.2)


def compose(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Center the textile on the standard catalogue canvas."""
    ys, xs = np.where(alpha > 10)
    x0, x1 = xs.min(), xs.max() + 1
    y0, y1 = ys.min(), ys.max() + 1
    rgb = rgb[y0:y1, x0:x1]
    alpha = alpha[y0:y1, x0:x1].astype(np.float32) / 255.0

    height, width = alpha.shape
    available_w = CANVAS_W * (1 - 2 * MARGIN)
    available_h = CANVAS_H * (1 - 2 * MARGIN)
    scale = min(available_w / width, available_h / height)
    new_w, new_h = max(1, round(width * scale)), max(1, round(height * scale))

    # Resize in premultiplied space to avoid dark halos along the cut-out edge.
    premultiplied = rgb.astype(np.float32) * alpha[..., None]
    premultiplied = cv2.resize(
        premultiplied, (new_w, new_h), interpolation=cv2.INTER_AREA
    )
    alpha = cv2.resize(alpha, (new_w, new_h), interpolation=cv2.INTER_AREA)

    clean_rgb = np.zeros_like(premultiplied)
    visible = alpha > 1e-4
    clean_rgb[visible] = np.clip(
        premultiplied[visible] / alpha[visible][..., None], 0, 255
    )

    canvas = np.full((CANVAS_H, CANVAS_W, 3), BACKGROUND, dtype=np.float32)
    offset_x = (CANVAS_W - new_w) // 2
    offset_y = (CANVAS_H - new_h) // 2 + 8

    # A soft contact shadow gives the textile depth on the ivory card.
    shadow = np.zeros((CANVAS_H, CANVAS_W), dtype=np.float32)
    shadow[offset_y : offset_y + new_h, offset_x : offset_x + new_w] = alpha * 0.18
    shadow = cv2.GaussianBlur(shadow, (0, 0), 14)
    canvas *= 1 - shadow[..., None]

    alpha3 = alpha[..., None]
    region = canvas[offset_y : offset_y + new_h, offset_x : offset_x + new_w]
    canvas[offset_y : offset_y + new_h, offset_x : offset_x + new_w] = (
        clean_rgb * alpha3 + region * (1 - alpha3)
    )

    return np.clip(canvas, 0, 255).astype(np.uint8)


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    sources = sorted(SOURCE.glob("IMG_*.PNG"))
    if not sources:
        raise SystemExit(f"No source images found in {SOURCE}")

    for index, path in enumerate(sources, start=1):
        rgba = np.array(Image.open(path).convert("RGBA"))
        rgb = rgba[:, :, :3].copy()
        alpha = rgba[:, :, 3].copy()

        rgb, alpha = deskew(rgb, alpha)
        alpha = clean_silhouette(alpha)
        output = compose(rgb, alpha)

        destination = DEST / f"tapiz-{index:02d}.webp"
        Image.fromarray(output).save(destination, "WEBP", quality=84, method=6)
        print(f"{path.name} -> {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
