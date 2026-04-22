export type ProjectType = "photo" | "video";

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
    role: "Photographie",
    type: "photo",
    category: "Portrait",
    coverPlaceholder: "#1E1A18",
    description:
      "Des portraits où le visage devient paysage — peau, pétale, ombre. Une série sur la douceur et l'exposition, captée en lumière naturelle diffuse. Chaque image tient juste assez longtemps pour mettre mal à l'aise.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#0F1115",
    description:
      "La nuit, lentement. Une série photographiée après minuit dans des pièces à peine éclairées et des rues vides — en travaillant avec ce qu'il restait de lumière. Corps, surfaces, objets : tout suspendu dans le même bleu.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#1A2430",
    description:
      "Une seule pièce, du carrelage bleu, un après-midi. La salle de bain comme scène — un lieu d'attente, de rituels privés. L'appareil reste immobile ; c'est la lumière qui bouge.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#1D2118",
    description:
      "Une répétition — le même parc, d'autres jours, d'autres lumières, d'autres gens. Une méditation sur le quotidien : regarder trois fois la même chose, ce n'est déjà plus la même chose.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#1A1414",
    description:
      "Une étude de la corde, de la tension, de la peau. Le shibari comme géométrie — le corps tenu par intervalles, la ligne tendue puis relâchée. Photographié en lumière rasante, disponible. Les images ne cherchent pas à expliquer ; elles regardent.",
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
    role: "Photographie",
    type: "photo",
    category: "Mode",
    coverPlaceholder: "#241820",
    description:
      "Rose, pressé, plastique. Une courte série éditoriale construite autour d'une seule couleur. Le jeu poussé jusqu'à la tension.",
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
    role: "Photographie",
    type: "photo",
    category: "Éditorial",
    coverPlaceholder: "#201A16",
    description:
      "Un intérieur pris au sérieux. Textiles, angles, la chorégraphie d'un lit fait. Une petite série sur la façon dont une pièce joue sa partition quand il n'y a personne.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#17181A",
    description:
      "Une figure entre deux états — ni apparaissant ni disparaissant. Trois images. Une histoire n'a pas toujours besoin de plus.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#141414",
    description:
      "Noir et blanc cassé. Une étude du contraste poussée jusqu'à faire disparaître tout ce qu'il y a entre les deux. Trois images qui ont appris à ne plus s'excuser.",
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
    role: "Photographie",
    type: "photo",
    category: "Personnel",
    coverPlaceholder: "#1C1E17",
    description:
      "Fin d'été, lumière longue. Des images faites avec la sensation d'un souvenir déjà en train de se former. Rien ne se passe ; quelque chose s'est passé.",
    imageFiles: [
      "P1002259-2_AVIF.avif",
      "P1002225_AVIF.avif",
      "P1002226_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
];
