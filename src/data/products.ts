import type { MaterialSettings } from "@/types/scene";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  skin: string;
  features: string[];
}

const SKINS = [
  "/assets/skins/skin.png",
  "/assets/skins/skin1.png",
  "/assets/skins/skin2.png",
  "/assets/skins/skin3.png",
];

const TAGLINES = [
  "Celestial glow",
  "Quiet radiance",
  "Stellar essence",
  "Cosmic whisper",
  "Eternal shimmer",
  "Luminous soul",
];

const FEATURES_POOL = [
  ["Stellar", "Handcrafted"],
  ["Radiant", "Polished"],
  ["Celestial", "Limited"],
  ["Artisan", "Luminous"],
  ["Ethereal", "Premium"],
];

const DESCRIPTION =
  "A celestial object of quiet distinction. Meticulously crafted for those who appreciate understated elegance.";

const STARS: Product[] = [
  { id: "classic",   name: "Classic Lantern", tagline: "Timeless radiance",   description: "A warm, inviting glow that evokes the comfort of heritage craftsmanship.",                                           price: 180, skin: SKINS[0], features: ["Warm Amber", "Matte Finish", "Hand-polished"] },
  { id: "crimson",   name: "Crimson Ember",   tagline: "Bold intensity",      description: "Forged in fire, this star commands attention with its deep, smoldering hue.",                                      price: 210, skin: SKINS[1], features: ["Deep Crimson", "Satin Glow", "Limited Edition"] },
  { id: "azure",     name: "Deep Azure",      tagline: "Oceanic calm",        description: "Cool and serene as the midnight sea. A statement of quiet confidence.",                                            price: 195, skin: SKINS[2], features: ["Ocean Blue", "Iridescent", "UV Reactive"] },
];

for (let i = 4; i <= 21; i++) {
  const idx = i - 4;
  STARS.push({
    id: `star-${String(i).padStart(2, "0")}`,
    name: `Star ${String(i).padStart(2, "0")}`,
    tagline: TAGLINES[idx % TAGLINES.length],
    description: DESCRIPTION,
    price: 10,
    skin: SKINS[idx % SKINS.length],
    features: FEATURES_POOL[idx % FEATURES_POOL.length],
  });
}

export const products: Product[] = STARS;

export const materialPresets: MaterialSettings[] = [
  { roughness: 0.35, metalness: 0.25, glow: 0.08, wireframe: false, lightOn: false },
  { roughness: 0.40, metalness: 0.30, glow: 0.12, wireframe: false, lightOn: false },
  { roughness: 0.30, metalness: 0.20, glow: 0.05, wireframe: false, lightOn: false },
];

export function getMaterial(index: number): MaterialSettings {
  return materialPresets[index % materialPresets.length];
}
