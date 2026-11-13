export interface Stone {
  id: string;
  name: string;
  benefit: string;
  zodiac: string;
  zodiacSymbol: string;
  accent: string;
}

export const stones: Stone[] = [
  {
    id: "malachite",
    name: "Malachite",
    benefit: "Transforms and protects",
    zodiac: "Scorpio",
    zodiacSymbol: "♏",
    accent: "#1f8a4c",
  },
  {
    id: "onyx",
    name: "Onyx",
    benefit: "Brings strength and stability",
    zodiac: "Capricorn",
    zodiacSymbol: "♑",
    accent: "#9a9a9a",
  },
  {
    id: "chakra",
    name: "Chakra",
    benefit: "Balances your energies",
    zodiac: "All signs",
    zodiacSymbol: "✶",
    accent: "#b5478a",
  },
  {
    id: "turquoise",
    name: "Turquoise",
    benefit: "Calms and protects",
    zodiac: "Sagittarius",
    zodiacSymbol: "♐",
    accent: "#2fb6b3",
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    benefit: "Attracts love and harmony",
    zodiac: "Taurus",
    zodiacSymbol: "♉",
    accent: "#e8a8b8",
  },
  {
    id: "tigers-eye",
    name: "Tiger's Eye",
    benefit: "Gives confidence and protection",
    zodiac: "Leo",
    zodiacSymbol: "♌",
    accent: "#b5732a",
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine",
    benefit: "Attracts good luck",
    zodiac: "Libra",
    zodiacSymbol: "♎",
    accent: "#2eae4e",
  },
  {
    id: "lapis-lazuli",
    name: "Lapis Lazuli",
    benefit: "Stimulates wisdom",
    zodiac: "Pisces",
    zodiacSymbol: "♓",
    accent: "#1f3fa8",
  },
  {
    id: "opal",
    name: "Opal",
    benefit: "Brings balance and serenity",
    zodiac: "Cancer",
    zodiacSymbol: "♋",
    accent: "#cfe3ef",
  },
  {
    id: "tree-agate",
    name: "Tree Agate",
    benefit: "Connects with nature",
    zodiac: "Virgo",
    zodiacSymbol: "♍",
    accent: "#6f9b6a",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    benefit: "Reduces stress and promotes calm",
    zodiac: "Aquarius",
    zodiacSymbol: "♒",
    accent: "#7a4bd0",
  },
  {
    id: "red-jasper",
    name: "Red Jasper",
    benefit: "Brings vitality and strength",
    zodiac: "Aries",
    zodiacSymbol: "♈",
    accent: "#a63a2a",
  },
];

export function getStone(id: string): Stone | undefined {
  return stones.find((stone) => stone.id === id);
}
