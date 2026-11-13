import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 6;

type Offset = { x: number; y: number };
type Point = { x: number; y: number };
type Gesture =
  | { mode: "pan"; startX: number; startY: number; startOffset: Offset }
  | {
      mode: "pinch";
      startDistance: number;
      startScale: number;
      startOffset: Offset;
      startMid: Point;
    }
  | null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

interface ProductImageLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export function ProductImageLightbox({ open, src, alt, onClose }: ProductImageLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef(MIN_SCALE);
  const offsetRef = useRef<Offset>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const commit = useCallback((nextScale: number, nextOffset: Offset) => {
    scaleRef.current = nextScale;
    offsetRef.current = nextOffset;
    setScale(nextScale);
    setOffset(nextOffset);
  }, []);

  const clampOffset = useCallback((nextScale: number, nextOffset: Offset): Offset => {
    const image = imageRef.current;
    if (!image) return { x: 0, y: 0 };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(0, (image.offsetWidth * nextScale - vw) / 2);
    const maxY = Math.max(0, (image.offsetHeight * nextScale - vh) / 2);

    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, clientX?: number, clientY?: number) => {
      const current = scaleRef.current;
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE);

      if (Math.abs(target - current) < 0.001) return;

      if (target === MIN_SCALE) {
        commit(MIN_SCALE, { x: 0, y: 0 });
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const px = (clientX ?? vw / 2) - vw / 2;
      const py = (clientY ?? vh / 2) - vh / 2;
      const previous = offsetRef.current;
      const ratio = target / current;

      commit(
        target,
        clampOffset(target, {
          x: px - (px - previous.x) * ratio,
          y: py - (py - previous.y) * ratio,
        }),
      );
    },
    [clampOffset, commit],
  );

  useEffect(() => {
    if (!open) return;
    commit(MIN_SCALE, { x: 0, y: 0 });
    pointers.current.clear();
    gestureRef.current = null;
    setDragging(false);
  }, [open, commit]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!open || !overlay) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomTo(scaleRef.current * factor, event.clientX, event.clientY);
    };

    overlay.addEventListener("wheel", onWheel, { passive: false });
    return () => overlay.removeEventListener("wheel", onWheel);
  }, [open, zoomTo]);

  const onPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];

    if (points.length === 1) {
      if (scaleRef.current > MIN_SCALE) {
        gestureRef.current = {
          mode: "pan",
          startX: event.clientX,
          startY: event.clientY,
          startOffset: offsetRef.current,
        };
        setDragging(true);
      } else {
        gestureRef.current = null;
      }
    } else if (points.length === 2) {
      const [a, b] = points;
      gestureRef.current = {
        mode: "pinch",
        startDistance: distance(a, b),
        startScale: scaleRef.current,
        startOffset: offsetRef.current,
        startMid: midpoint(a, b),
      };
      setDragging(true);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = gestureRef.current;
    if (!gesture) return;

    const points = [...pointers.current.values()];

    if (gesture.mode === "pan" && points.length === 1) {
      const nextOffset = clampOffset(scaleRef.current, {
        x: gesture.startOffset.x + (event.clientX - gesture.startX),
        y: gesture.startOffset.y + (event.clientY - gesture.startY),
      });
      offsetRef.current = nextOffset;
      setOffset(nextOffset);
      return;
    }

    if (gesture.mode === "pinch" && points.length >= 2) {
      if (gesture.startDistance === 0) return;

      const [a, b] = points;
      const target = clamp(
        gesture.startScale * (distance(a, b) / gesture.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const mid = midpoint(a, b);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mx = mid.x - vw / 2;
      const my = mid.y - vh / 2;
      const m0x = gesture.startMid.x - vw / 2;
      const m0y = gesture.startMid.y - vh / 2;
      const ratio = target / gesture.startScale;

      const nextOffset = clampOffset(target, {
        x: mx - (m0x - gesture.startOffset.x) * ratio,
        y: my - (m0y - gesture.startOffset.y) * ratio,
      });

      commit(target, nextOffset);
    }
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLImageElement>) => {
    pointers.current.delete(event.pointerId);
    const points = [...pointers.current.values()];

    if (points.length === 1) {
      const point = points[0];
      gestureRef.current = {
        mode: "pan",
        startX: point.x,
        startY: point.y,
        startOffset: offsetRef.current,
      };
    } else if (points.length === 0) {
      gestureRef.current = null;
      setDragging(false);
    }
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    if (scaleRef.current > MIN_SCALE + 0.05) {
      zoomTo(MIN_SCALE);
    } else {
      zoomTo(2.5, event.clientX, event.clientY);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} ampliado`}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1f2a27]/90 p-4 backdrop-blur-sm"
          style={{ touchAction: "none" }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Cerrar imagen ampliada"
          >
            <X size={20} />
          </button>

          <motion.img
            ref={imageRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={src}
            alt={alt}
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onDoubleClick={onDoubleClick}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] max-w-[94vw] select-none rounded-2xl object-contain shadow-2xl"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              transition: dragging ? "none" : "transform .18s ease-out",
              touchAction: "none",
              cursor: scale > MIN_SCALE ? (dragging ? "grabbing" : "grab") : "zoom-in",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 px-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/35 p-1 text-white backdrop-blur">
              <button
                type="button"
                onClick={() => zoomTo(scaleRef.current - 0.5)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15 disabled:opacity-40"
                disabled={scale <= MIN_SCALE}
                aria-label="Alejar imagen"
              >
                <Minus size={17} />
              </button>
              <span className="w-12 text-center text-xs tabular-nums">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                onClick={() => zoomTo(scaleRef.current + 0.5)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15 disabled:opacity-40"
                disabled={scale >= MAX_SCALE}
                aria-label="Acercar imagen"
              >
                <Plus size={17} />
              </button>
              <button
                type="button"
                onClick={() => zoomTo(MIN_SCALE)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15 disabled:opacity-40"
                disabled={scale <= MIN_SCALE}
                aria-label="Restablecer zoom"
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <p className="text-center text-[10px] text-white/70">
              Rueda o pellizca para hacer zoom · Arrastra para mover · Doble clic para ampliar
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
