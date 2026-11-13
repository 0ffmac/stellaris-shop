import type { CategoryId } from "@/data/categories";
import { stones } from "@/data/stones";

export interface CatalogProduct {
  id: string;
  category: CategoryId;
  name: string;
  image: string;
  price?: number;
  benefit?: string;
  zodiac?: string;
  zodiacSymbol?: string;
  accent?: string;
  imageAspect?: string;
  features?: string[];
  note?: string;
  description?: string;
  details?: string[];
  sizes?: string[];
  measurements?: string;
}

// Prices are retained from the supplied project data and should be verified before launch.
export const BRACELET_PRICE = 5;

const stars: CatalogProduct[] = [
  {
    id: "star-01",
    category: "stars",
    name: "Estrella modelo 01",
    image: "/assets/stars/catalog/modelo-01.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-02",
    category: "stars",
    name: "Estrella modelo 02",
    image: "/assets/stars/catalog/modelo-02.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-03",
    category: "stars",
    name: "Estrella modelo 03",
    image: "/assets/stars/catalog/modelo-03.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-04",
    category: "stars",
    name: "Estrella modelo 04",
    image: "/assets/stars/catalog/modelo-04.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-05",
    category: "stars",
    name: "Estrella modelo 05",
    image: "/assets/stars/catalog/modelo-05.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-06",
    category: "stars",
    name: "Estrella modelo 06",
    image: "/assets/stars/catalog/modelo-06.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-07",
    category: "stars",
    name: "Estrella modelo 07",
    image: "/assets/stars/catalog/modelo-07.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-08",
    category: "stars",
    name: "Estrella modelo 08",
    image: "/assets/stars/catalog/modelo-08.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-09",
    category: "stars",
    name: "Estrella modelo 09",
    image: "/assets/stars/catalog/modelo-09.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-10",
    category: "stars",
    name: "Estrella modelo 10",
    image: "/assets/stars/catalog/modelo-10.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-11",
    category: "stars",
    name: "Estrella modelo 11",
    image: "/assets/stars/catalog/modelo-11.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-12",
    category: "stars",
    name: "Estrella modelo 12",
    image: "/assets/stars/catalog/modelo-12.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-13",
    category: "stars",
    name: "Estrella modelo 13",
    image: "/assets/stars/catalog/modelo-13.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-14",
    category: "stars",
    name: "Estrella modelo 14",
    image: "/assets/stars/catalog/modelo-14.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-15",
    category: "stars",
    name: "Estrella modelo 15",
    image: "/assets/stars/catalog/modelo-15.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-16",
    category: "stars",
    name: "Estrella modelo 16",
    image: "/assets/stars/catalog/modelo-16.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-17",
    category: "stars",
    name: "Estrella modelo 17",
    image: "/assets/stars/catalog/modelo-17.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-18",
    category: "stars",
    name: "Estrella modelo 18",
    image: "/assets/stars/catalog/modelo-18.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-19",
    category: "stars",
    name: "Estrella modelo 19",
    image: "/assets/stars/catalog/modelo-19.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-20",
    category: "stars",
    name: "Estrella modelo 20",
    image: "/assets/stars/catalog/modelo-20.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
  {
    id: "star-21",
    category: "stars",
    name: "Estrella modelo 21",
    image: "/assets/stars/catalog/modelo-21.webp",
    features: ["Fotografía de producto", "Diseño disponible"],
    note: "Consulta disponibilidad, medidas y precio antes de realizar tu pedido.",
  },
];

const bracelets: CatalogProduct[] = stones.map((stone) => ({
  id: `bracelet-${stone.id}`,
  category: "bracelets",
  name: `Pulsera de ${stone.name}`,
  image: `/assets/bracelets/${stone.id}.jpg`,
  price: BRACELET_PRICE,
  benefit: stone.benefit,
  zodiac: stone.zodiac,
  zodiacSymbol: stone.zodiacSymbol,
  accent: stone.accent,
  imageAspect: "aspect-[3/2]",
  features: ["Cuentas de piedra", "Montaje en pulsera"],
  note: "Las propiedades energéticas son atribuciones tradicionales, no efectos médicos demostrados.",
}));

const TEXTILE_DESCRIPTION =
  "Tapiz de patchwork artesanal con bordados, lentejuelas y apliques textiles. Una pieza única llena de color, textura y carácter para vestir una pared o un rincón especial.";

const textiles: CatalogProduct[] = Array.from({ length: 17 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `textile-${number}`,
    category: "textiles",
    name: `Tapiz modelo ${number}`,
    image: `/assets/tapestries/catalog/tapiz-${number}.webp`,
    imageAspect: "aspect-[4/5]",
    description: TEXTILE_DESCRIPTION,
    details: [
      "Técnica: patchwork y bordado decorativo",
      "Pieza única: el diseño que ves es el que recibes",
      "Cuidados: limpieza en seco y evitar la exposición directa al sol",
    ],
    sizes: ["Pequeño", "Mediano", "Grande"],
    measurements:
      "Las medidas exactas de cada pieza se confirman por email antes de preparar el pedido.",
    features: ["Patchwork artesanal", "Bordado y apliques", "Pieza única"],
    note: "Pieza única. Consulta medidas, disponibilidad y precio antes de realizar tu pedido.",
  };
});

export const catalog: CatalogProduct[] = [...stars, ...bracelets, ...textiles];

export function getProduct(id: string | undefined): CatalogProduct | undefined {
  return catalog.find((product) => product.id === id);
}

export function getProductsByCategory(category: CategoryId): CatalogProduct[] {
  return catalog.filter((product) => product.category === category);
}
