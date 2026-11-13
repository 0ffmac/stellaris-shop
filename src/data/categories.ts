import {
  Flame, Gem, Lamp, Layers3, Star, type LucideIcon,
} from "lucide-react";

export type CategoryId = "stars" | "lamps" | "bracelets" | "incense" | "textiles";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imageWidth?: number;
  imageHeight?: number;
  banner?: boolean;
  icon: LucideIcon;
  accent: string;
  eyebrow: string;
}

export const categories: Category[] = [
  {
    id: "stars",
    name: "Estrellas de papel",
    eyebrow: "Un diseño · infinitas posibilidades",
    blurb: "Nuestro diseño original, vestido con distintos papeles, patrones y colores.",
    image: "/assets/stars.webp",
    imageAlt: "Estrella de papel iluminada colgada junto a una vela y una lámpara",
    imageFit: "cover",
    imageWidth: 1114,
    imageHeight: 1128,
    icon: Star,
    accent: "from-amber-100 via-rose-100 to-stone-100",
  },
  {
    id: "lamps",
    name: "Lámparas turcas",
    eyebrow: "Luz con carácter",
    blurb: "Lámparas de mosaico que llenan cada rincón de color, calidez y personalidad.",
    image: "/assets/turkish-lamp-reference.jpg",
    imageWidth: 817,
    imageHeight: 1005,
    icon: Lamp,
    accent: "from-rose-200 via-orange-100 to-amber-100",
  },
  {
    id: "bracelets",
    name: "Pulseras y gemas",
    eyebrow: "Belleza natural",
    blurb: "Pulseras de cuentas y piedras con colores, texturas e historias propias.",
    image: "/assets/bracelets/rose-quartz.jpg",
    imageWidth: 900,
    imageHeight: 598,
    icon: Gem,
    accent: "from-emerald-100 via-stone-100 to-[#e7e2d7]",
  },
  {
    id: "incense",
    name: "Aromas y rituales",
    eyebrow: "Pausas para ti",
    blurb: "Incienso, salvia y palo santo para acompañar tus momentos de calma.",
    icon: Flame,
    accent: "from-terracotta-100 via-orange-100 to-amber-100",
  },
  {
    id: "textiles",
    name: "Tapices y textiles",
    eyebrow: "Texturas que cuentan",
    blurb: "Piezas textiles de inspiración hindú y bohemia para dar vida a tus paredes.",
    image: "/assets/tapices.webp",
    imageAlt: "Tapiz bordado artesanal sobre una mesa de madera con una lámpara y flores",
    imageFit: "cover",
    imageWidth: 1122,
    imageHeight: 1136,
    banner: true,
    icon: Layers3,
    accent: "from-indigo-100 via-violet-100 to-rose-100",
  },
];

export function getCategory(id: string | undefined): Category | undefined {
  return categories.find((category) => category.id === id);
}
