export type ProjectType = "photo" | "video" | "3d";

export interface ProjectMeta {
  type: string;      // e.g. "Mode / projet personnel"
  location: string;  // e.g. "Bordeaux, France"
  credits: string;   // e.g. "Photo & post-prod"
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  role: string;
  type: ProjectType;
  category: string;
  coverPlaceholder: string;
  meta: ProjectMeta;
  description?: string;
  images?: number;
  imageFiles?: string[];
  videoUrl?: string;
  /** Native aspect ratio of the source video as a CSS aspect-ratio string, e.g. "2.35/1" for cinemascope. Defaults to "16/9". */
  videoAspect?: string;
  youtubeId?: string;
  featured?: boolean;
  aspectRatio?: "landscape" | "portrait" | "square";
}

export const projects: Project[] = [
  {
    slug: "showreel-3d",
    title: "Showreel 3D",
    year: 2024,
    role: "Réalisation",
    type: "3d",
    category: "3D",
    coverPlaceholder: "#0A0A0C",
    meta: {
      type: "Showreel / motion design 3D",
      location: "Bordeaux, France",
      credits: "Réalisation & post-prod",
    },
    videoUrl: "https://vimeo.com/722586890",
    videoAspect: "2.39/1",
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "sink-deeper-the-other",
    title: "The Other",
    year: 2024,
    role: "Réalisation",
    type: "video",
    category: "Clip",
    coverPlaceholder: "#0B0A0D",
    meta: {
      type: "Clip musical pour Sink Deeper",
      location: "Clermont-Ferrand, France",
      credits: "Réalisation & montage",
    },
    youtubeId: "ypJkTv3gFX8",
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "affinessence",
    title: "Affinessence",
    year: 2024,
    role: "Réalisation",
    type: "video",
    category: "Pub",
    coverPlaceholder: "#14100E",
    meta: {
      type: "Pub parfum pour Affinessence",
      location: "Paris, France",
      credits: "Réalisation & post-prod",
    },
    videoUrl: "https://vimeo.com/1033824012",
    videoAspect: "4/5",
    aspectRatio: "portrait",
    featured: true,
  },
  {
    slug: "face-flower",
    title: "Face Flower",
    year: 2024,
    role: "Photographie",
    type: "photo",
    category: "Portrait",
    coverPlaceholder: "#1E1A18",
    meta: {
      type: "Portrait / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Nocturne / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Intérieur / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Paysage / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Documentaire / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Mode / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Éditorial / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Fiction / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Série noir & blanc / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
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
    meta: {
      type: "Paysage / projet personnel",
      location: "Bordeaux, France",
      credits: "Photo & post-prod",
    },
    imageFiles: [
      "P1002259-2_AVIF.avif",
      "P1002225_AVIF.avif",
      "P1002226_AVIF.avif",
    ],
    aspectRatio: "landscape",
  },
];
