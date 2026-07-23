# Estrelles Studio — Luxury Celestial Objects Shop

An interactive 3D e-commerce landing page for a luxury star shop, built with React, Three.js, and Tailwind CSS. Features a fully interactive 3D star viewer with customizable skins, lighting scene presets, and smooth scroll animations.

## Live Site

https://estrellesstudio.com

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [How It Works](#how-it-works)
  - [3D Rendering Engine](#3d-rendering-engine)
  - [Lighting System](#lighting-system)
  - [Skin / Texture System](#skin--texture-system)
  - [UV Mapping Fix](#uv-mapping-fix)
  - [Scene Presets](#scene-presets)
  - [Hero Section](#hero-section)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Adding Skins](#adding-skins)
- [Adding Scene Presets](#adding-scene-presets)
- [Project Structure](#project-structure)

---

## Technology Stack

| Layer | Library |
|---|---|
| Framework | React 19 |
| 3D Engine | Three.js 0.185 |
| 3D Controls | OrbitControls (drag to orbit, scroll to zoom) |
| Model Format | GLTF Binary (.glb) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 (scroll-driven parallax, entry animations) |
| Icons | Lucide React |
| Language | TypeScript 5.6 |
| Build Tool | Vite 7 |
| Package Manager | pnpm |
| Deployment | Cloudflare Pages |
| OG Image | 1200×630 JPG served from site root |

---

## How It Works

### 3D Rendering Engine

The 3D viewer is powered by a custom React hook (`useStarViewer`) that manages the entire Three.js lifecycle:

1. **Canvas Setup** — A `WebGLRenderer` is created with `ACESFilmicToneMapping` for cinematic color grading and `SRGBColorSpace` output. Pixel ratio is capped at 2x for performance.
2. **Scene** — A `THREE.Scene` with a configurable background color matching the active scene preset.
3. **Camera** — A `PerspectiveCamera` with configurable position and field of view (default FOV 40, adjustable per preset).
4. **OrbitControls** — Users can drag to orbit the camera, scroll to zoom. Controls target follows the model position.
5. **Animation Loop** — Uses `requestAnimationFrame` with a `THREE.Clock` for delta-based auto-rotation. The model group rotates on its Y axis at a configurable speed.
6. **Responsive** — A resize handler updates camera aspect ratio and renderer size on window resize.

### Lighting System

Each scene preset defines a three-point lighting setup:

- **Ambient Light** — Uniform base illumination with configurable color and intensity. Provides overall scene visibility.
- **Key Light** — A `DirectionalLight` positioned above and to one side. This is the primary light source that defines the star's main shading and highlights.
- **Fill Light** — A second `DirectionalLight` from the opposite side, softer, to fill shadows and reveal detail.

This mimics professional product photography lighting. The three presets (Studio, Living Room, Christmas) each use different light colors and positions to create distinct moods.

### Skin / Texture System

The star model is textured using 2D PNG images that wrap around the 3D geometry:

- **Default Skins** — Four built-in skins defined in `DEFAULT_SKINS` array. Each has an `id`, display `name`, and PNG file URL.
- **Texture Loading** — Skins are loaded via `THREE.TextureLoader` with `SRGBColorSpace`, `ClampToEdgeWrapping`, and no Y-flip.
- **Custom Uploads** — Users can upload their own images via the UI. Uploaded files are converted to object URLs (blob: URLs) and added to the skin list. These are in-memory only and not persisted.
- **Active State** — The active skin is tracked by `activeSkinId`, and clicking a thumbnail updates the texture on the 3D model in real-time.

### UV Mapping Fix

The 3D star model (`Star.glb`) has a **broken UV map** — all vertices are mapped to a single UV coordinate (typically 0,1), which means textures appear as a single color across the entire surface instead of wrapping properly.

The `useStarViewer` hook includes an automatic UV fix:

1. On model load, it traverses all meshes and checks the UV attribute.
2. It computes the min/max of all UV coordinates. If all U values are equal AND all V values are equal, the UVs are broken.
3. It then reads the vertex **positions** (X and Z coordinates) and computes new UV coordinates by normalizing each vertex's X and Z position to the 0–1 range.
4. This creates a planar XZ projection UV map — the model is effectively unwrapped from the top-down view.
5. The `needsUpdate` flag is set to `true` to upload the corrected UVs to the GPU.

This means the texture wraps the model correctly despite the original model having no valid UV data. The result is a seamless, properly textured 3D star.

### Scene Presets

Three lighting environments are available, each providing a different visual mood:

- **Studio** (`#1c1c24`) — Clean, neutral white lighting. Best for product photography. Neutral background.
- **Living Room** (`#2a2018`) — Warm, cozy lighting with amber/yellow tones. Mimics a home environment.
- **Christmas** (`#0a0a1a`) — Festive colored lighting with red key light and green fill light. Dark night sky background.

Each preset controls: background color, all three light colors and intensities, light positions, camera position, auto-rotation speed, and field of view.

### Products & Pricing

The collection is defined in `src/data/products.ts` as an array of `Product` objects:

```ts
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;       // in €
  skin: string;         // texture path
  features: string[];
}
```

Currently **21 products** are available — 3 signature stars (Classic Lantern 180€, Crimson Ember 210€, Deep Azure 195€) and 18 additional stars at 10€ each. Product data is fully decoupled from the UI: edit a single file to add, remove, or modify any star.

Material presets cycle through 3 lighting variants automatically for visual variety across the collection.

### Hero Section

The hero (`HeroSection.tsx`) is a full-screen layout:

- **Background** — The 3D star viewer fills the entire viewport, with a parallax scale effect tied to scroll position.
- **Gradient Overlay** — A subtle left-to-right gradient (`stone-950/80 → transparent`) improves text readability.
- **Title** — "Celestial / Crafted for the Cosmos" overlaid on the left side, visible on all screen sizes. On mobile, only the title shows at the top-left; on desktop, the full tagline, description, and CTA buttons appear.
- **Bottom Controls Dock** — Contains:
  - Play/Pause toggle for auto-rotation
  - Scene preset selector (Studio / Living Room / Christmas)
  - Skin thumbnail selector with upload and delete
  - Scene description
- **Mobile Layout** — Two rows: skins + upload on top row, play/pause + scenes on bottom row. Desktop has a single row.

---

## Architecture

```
src/
├── data/
│   └── products.ts            # Product definitions (21 products, prices, skins, features)
├── types/
│   └── scene.ts               # TypeScript interfaces (ScenePreset, SkinPreset, MaterialSettings, StarViewerProps)
├── scenes/
│   └── presets.ts              # Scene preset configurations (Studio, Living Room, Christmas)
├── hooks/
│   └── useStarViewer.ts       # Three.js lifecycle hook (renderer, scene, camera, lights, model, animation loop, UV fix)
└── components/
    ├── StarViewer.tsx          # Pure 3D viewer component (wraps the hook, shows loading/error states)
    ├── HeroSection.tsx         # Full-screen hero with title overlay, controls dock, mobile/desktop layouts
    ├── Navbar.tsx              # Fixed top navigation bar
    ├── ProductsSection.tsx     # Product cards, each with its own inline StarViewer
    ├── AboutSection.tsx        # About/brand story section with scroll animations
    └── Footer.tsx              # Site footer
```

### Data Flow

```
Product[] ─────────→ ProductsSection ──→ ProductCard ──→ StarViewer
                        │ (grid)              │
                        │                     ├─ price (€)
                        │                     ├─ features
                        │                     └─ skin texture
                        │
ScenePreset[] ──→ HeroSection ──→ StarViewer (full-screen)
SkinPreset[]  ──→ HeroSection ──→ textureUrl prop
MaterialSettings ─→ heroMaterial ──→ material prop (hero)
                                        │
                                        ▼
                               useStarViewer hook
                                        │
                        ┌────────────────┼────────────────┐
                        ▼                ▼                ▼
                    Three.js       Animation        UV Fix
                    Renderer        Loop         (auto-detect
                                                & recompute)
```

---

## Installation

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/0ffmac/stellaris-shop.git
cd stellaris-shop

# Install dependencies
pnpm install

# Start development server
pnpm dev        # → http://localhost:3001

# TypeScript check and production build
pnpm build

# Preview production build locally
pnpm preview
```

---

## Usage

### Standalone 3D Viewer

```tsx
import { StarViewer } from "@/components/StarViewer";
import { scenePresets } from "@/scenes/presets";

function ProductCard() {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <StarViewer
        textureUrl="/assets/skins/skin3.png"
        scenePreset={scenePresets[0]}
        material={{ roughness: 0.35, metalness: 0.25, glow: 0.08, wireframe: false }}
      />
    </div>
  );
}
```

### Programmatic Skin Switching

```tsx
const [activeSkin, setActiveSkin] = useState(DEFAULT_SKINS[0]);

<StarViewer
  textureUrl={activeSkin.url}
  scenePreset={activeScene}
  material={heroMaterial}
/>
```

### Custom Camera and Model Position

The `ScenePreset` supports optional `modelPosition` and `fov` fields to offset the model from the camera's look-at point:

```ts
const activeScene = {
  ...basePreset,
  cameraPosition: [-4, 0.4, 4.5] as [number, number, number],
  modelPosition: [1, 0, 0] as [number, number, number],
  fov: 26,
};
```

This shifts the model right in the viewport while the camera orbits around the model.

---

## Deployment

The site is deployed on **Cloudflare Pages**.

### Manual Deployment

```bash
# Build for production
pnpm build

# Deploy to production (requires wrangler login)
npx wrangler pages deploy dist --project-name estrellesstudio --branch production

# Deploy to preview
npx wrangler pages deploy dist --project-name estrellesstudio --branch main
```

### Cache Configuration

A `public/_headers` file configures Cloudflare edge caching:

- **HTML** — `Cache-Control: no-cache, no-store, must-revalidate` (always serve fresh)
- **Static assets** (`/assets/*`) — `Cache-Control: public, max-age=31536000, immutable` (cache forever — files have content-hashed names)

### Social Preview

The `public/og-image.jpg` (1200×630 JPG) is used by Open Graph and Twitter Cards when the page is shared.

---

## Adding Products / Stars

1. Open `src/data/products.ts`
2. Add a new entry to the `STARS` array following the `Product` interface:

```ts
{
  id: "new-star",
  name: "Your Star Name",
  tagline: "Short descriptor",
  description: "A longer description of the product.",
  price: 10,              // price in €
  skin: "/assets/skins/your-texture.png",
  features: ["Feature 1", "Feature 2"],
}
```

3. If you have a custom skin texture, place the PNG in `public/assets/skins/`
4. Optionally add the new skin to `DEFAULT_SKINS` in `src/components/HeroSection.tsx` to make it available in the hero viewer

The grid layout uses 3 columns on desktop and wraps automatically — no other changes needed.

## Adding Skins

1. Place a PNG texture file in `public/assets/skins/`
2. Add an entry to `DEFAULT_SKINS` in `src/components/HeroSection.tsx`:

```ts
{ id: "skin4", name: "Your Skin Name", url: "/assets/skins/your-file.png" }
```

Skins should be square or rectangular PNG images. The UV fix projects them onto the model using planar XZ mapping, so the texture layout is top-down. For best results, use high-contrast, tileable patterns.

Users can also upload custom images through the bottom dock upload button (stored as in-memory object URLs, not persisted across page reloads).

---

## Adding Scene Presets

Edit `src/scenes/presets.ts` and append to the array:

```ts
{
  id: "moonlight",
  name: "Moonlight",
  description: "Cool blue night lighting",
  backgroundColor: "#0a0a1e",
  ambientIntensity: 0.2,
  ambientColor: "#4466aa",
  keyLightIntensity: 1.8,
  keyLightPosition: [-4, 3, 5],
  keyLightColor: "#aaccff",
  fillLightIntensity: 0.4,
  fillLightPosition: [3, 1, 4],
  fillLightColor: "#88aaff",
  cameraPosition: [0, 0.4, 4.5],
  autoRotate: true,
  autoRotateSpeed: 0.8,
}
```

All presets render automatically in the scene selector UI.

---

## Project Structure

```
estrellesstudio/
├── public/
│   ├── assets/
│   │   ├── models/
│   │   │   └── Star.glb         # 3D star model (GLTF Binary)
│   │   └── skins/
│   │       ├── skin.png         # Classic Lantern
│   │       ├── skin1.png        # Crimson Ember
│   │       ├── skin2.png        # Deep Azure
│   │       └── skin3.png        # Solar Gold
│   ├── _headers                 # Cloudflare Pages cache headers
│   └── og-image.jpg             # Social preview image (1200×630)
├── src/
│   ├── data/
│   │   └── products.ts          # Product catalog (21 products, prices, skins)
│   ├── types/scene.ts           # TypeScript interfaces
│   ├── scenes/presets.ts        # Scene lighting presets
│   ├── hooks/useStarViewer.ts   # Three.js lifecycle hook
│   ├── components/              # React components
│   │   ├── StarViewer.tsx       # 3D viewer wrapper
│   │   ├── HeroSection.tsx      # Landing page hero
│   │   ├── Navbar.tsx           # Navigation
│   │   ├── ProductsSection.tsx  # Product showcase
│   │   ├── AboutSection.tsx     # Brand story
│   │   └── Footer.tsx           # Footer
│   ├── App.tsx                  # Page composition
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── index.html                   # HTML entry point with OG tags
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── wrangler.toml                # Cloudflare Pages deployment config
└── package.json                 # Dependencies and scripts
```

---

## Notes

- The Star.glb model shipped with a broken UV map (all vertices at UV 0,1). The `useStarViewer` hook auto-detects this condition by checking if all UV coordinates are identical, then recomputes them from vertex XZ positions. For optimal texture alignment, re-export the model from Blender with proper UV unwrapping.
- The three-point lighting system (ambient + key + fill) follows standard product photography practice. Light positions and colors are fully configurable per preset.
- Auto-rotation uses a delta-based clock to ensure consistent speed across different frame rates.
- On mobile, the hero shows only the title at top-left and a two-row controls dock (skins on top, scenes below) for better touch accessibility.
- The `_headers` file prevents Cloudflare from caching `index.html`, ensuring instant updates after deployment. Static assets with content hashes are cached indefinitely.
