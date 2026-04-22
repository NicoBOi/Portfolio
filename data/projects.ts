export type ProjectType = "photo" | "video" | "experimental";

export interface Project {
  slug: string;
  title: string;
  year: number;
  role: string;
  type: ProjectType;
  category: string;
  coverPlaceholder: string;
  description?: string;
  images?: number;
  imageFiles?: string[];
  videoUrl?: string;
  youtubeId?: string;
  featured?: boolean;
  aspectRatio?: "landscape" | "portrait" | "square";
}

export const projects: Project[] = [
  {
    slug: "face-flower",
    title: "Face Flower",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Portrait",
    coverPlaceholder: "#1E1A18",
    description:
      "Portraits where the face becomes landscape — skin, petal, shadow. A series on softness and exposure, shot in diffused natural light. Each frame holds long enough to feel uncomfortable.",
    imageFiles: [
      "DSCF7145-Modifier_AVIF.avif",
      "DSCF7125_AVIF.avif",
      "DSCF7253_AVIF.avif",
      "DSCF7469_AVIF.avif",
      "DSCF7503_AVIF.avif",
      "DSCF7515_AVIF.avif",
      "DSCF7516_AVIF.avif",
      "DSCF7545_AVIF.avif",
    ],
    aspectRatio: "portrait",
    featured: true,
  },
  {
    slug: "floating-night",
    title: "Floating Night",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#0F1115",
    description:
      "Night walked slowly. A series shot after midnight in half-lit rooms and empty streets, working with whatever light was left. Bodies, surfaces, objects — all suspended in the same blue.",
    imageFiles: [
      "DSCF0244_AVIF.avif",
      "DSCF0356-2_AVIF.avif",
      "DSCF0378_AVIF.avif",
      "DSCF0425-3_AVIF.avif",
      "DSCF0598-Modifier-2_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "blue-bathroom",
    title: "Blue Bathroom",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#1A2430",
    description:
      "A single room, blue tile, one afternoon. The bathroom as stage — a place of waiting, of private rituals. The camera stays still; the light does the moving.",
    imageFiles: [
      "P1000698_AVIF.avif",
      "P1000705_AVIF.avif",
      "P1000716_AVIF.avif",
      "P1000722_AVIF.avif",
      "P1000789_AVIF.avif",
      "P1000802_AVIF.avif",
      "P1000810_AVIF.avif",
      "P1000831_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "parc-parc-parc",
    title: "Parc Parc Parc",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#1D2118",
    description:
      "A repetition — the same park, different days, different weather, different people. A meditation on the ordinary, and on how looking at something three times is already different from looking at it once.",
    imageFiles: [
      "DSCF1302_AVIF.avif",
      "DSCF0221_AVIF.avif",
      "DSCF0864_AVIF.avif",
      "DSCF1050_AVIF.avif",
      "DSCF1083_AVIF.avif",
      "DSCF1425_AVIF.avif",
      "DSCF1448_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "shibari",
    title: "Shibari",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#1A1414",
    description:
      "A study of rope, tension, and skin. Shibari as geometry — the body held in controlled intervals, the line drawn tight then released. Shot in low, available light. The photographs refuse to explain; they watch.",
    imageFiles: [
      "14_AVIF.avif",
      "3_AVIF.avif",
      "4_AVIF.avif",
      "6_AVIF.avif",
      "7_AVIF.avif",
      "10_AVIF.avif",
      "21_AVIF.avif",
      "23_AVIF.avif",
    ],
    aspectRatio: "portrait",
  },
  {
    slug: "bubble-gum",
    title: "Bubble Gum",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Fashion",
    coverPlaceholder: "#241820",
    description:
      "Pink, pressed, plastic. A short fashion-editorial series using a single colour as premise. Play pushed until it reads as tension.",
    imageFiles: [
      "DSCF0493_AVIF.avif",
      "DSCF0129_AVIF.avif",
      "DSCF0263_AVIF.avif",
      "DSCF0537_AVIF.avif",
      "DSCF0676_AVIF.avif",
    ],
    aspectRatio: "portrait",
  },
  {
    slug: "classy-bedroom",
    title: "Classy Bedroom",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Editorial",
    coverPlaceholder: "#201A16",
    description:
      "An interior taken seriously. Textiles, angles, the choreography of a made bed. A small series about how a room performs when nobody is in it.",
    imageFiles: [
      "P1001688-2_AVIF.avif",
      "P1001662_AVIF.avif",
      "P1001664-2_AVIF.avif",
      "P1001699-2_AVIF.avif",
      "P1001732_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
  {
    slug: "liminal-nymph",
    title: "Liminal Nymph",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#17181A",
    description:
      "A figure between states — neither emerging nor disappearing. Three frames. A whole story doesn't always require more.",
    imageFiles: [
      "DSCF6154_AVIF.avif",
      "DSCF6082_AVIF.avif",
      "DSCF6207_AVIF.avif",
    ],
    aspectRatio: "portrait",
  },
  {
    slug: "noir-blanc-casse",
    title: "Noir & Blanc Cassé",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#141414",
    description:
      "Black and broken white. A study in contrast pushed until everything in between collapses. Three images that learned to stop apologising.",
    imageFiles: [
      "P1002222_AVIF.avif",
      "P1001913-3_AVIF.avif",
      "P1002247_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
  {
    slug: "nostalgic-grass",
    title: "Nostalgic Grass",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#1C1E17",
    description:
      "Late summer, long light. Images made with the feeling of a memory already forming. Nothing happens; something has happened.",
    imageFiles: [
      "P1002259-2_AVIF.avif",
      "P1002225_AVIF.avif",
      "P1002226_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
];
