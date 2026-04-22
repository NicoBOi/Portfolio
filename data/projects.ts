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
      "Des visages tenus trop longtemps. Quand la peau cesse d'être un portrait et devient un territoire. Regardez. Tenez le regard. Quelque chose finit par céder.",
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
      "Tournée après minuit, quand les corps oublient qu'on les regarde. La nuit n'est pas sombre — elle est bleue, lente, précise. On y voit mieux qu'on ne croit.",
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
      "Une pièce. Du carrelage bleu. Une figure qui ne sort pas. Les salles de bain gardent les secrets que les chambres trahissent. Celle-ci est pleine.",
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
      "Le même parc, trois fois. Trois lumières, trois absences, trois façons de ne rien voir. Ce qu'on regarde longtemps finit par nous regarder en retour.",
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
      "La corde dit ce que les mots refusent. Un corps tenu, relâché, tenu encore. Ce n'est pas une soumission — c'est une précision. Un langage qui n'a besoin de personne pour se traduire.",
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
      "Rose. Presque trop. Une seule couleur, poussée jusqu'à ce que le jeu devienne une menace. Cinq images — pas une de plus.",
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
      "Une chambre vide ne l'est jamais vraiment. Les tissus se souviennent. La lumière attend. Chaque angle tient une conversation qu'on n'entendra pas.",
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
      "Ni arrivée, ni partie. Entre les deux, une figure qu'on n'arrive pas à nommer. Trois images suffisent — le reste se construit dans votre regard.",
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
      "Contraste poussé jusqu'au bord. Noir. Blanc cassé. Rien au milieu. Ces images ne s'excusent plus d'exister — c'est leur seul projet.",
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
      "Fin d'été. Lumière qui s'étire. Des images prises avec le pressentiment qu'elles deviendraient des souvenirs avant même d'exister.",
    imageFiles: [
      "P1002259-2_AVIF.avif",
      "P1002225_AVIF.avif",
      "P1002226_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
];
