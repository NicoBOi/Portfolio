export type ProjectType = "photo" | "video" | "3d";

export interface Project {
  slug: string;
  title: string;
  year: number;
  role: string;
  type: ProjectType;
  category: string;
  coverPlaceholder: string;
  description?: string;
  imageFiles?: string[];
  videoUrl?: string;
  /** Self-hosted hero loop, filename in /public/projects/<slug>/. Used as
      the landing background when present — falls back to videoUrl /
      youtubeId / first image otherwise. */
  videoFile?: string;
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
    description:
      "Mes projets 3D — commerciaux comme personnels — montés sur un seul rythme.",
    videoUrl: "https://vimeo.com/722586890",
    videoFile: "hero.webm",
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
    description:
      "Premier clip de Sink Deeper, réalisé et monté de bout en bout.",
    youtubeId: "ypJkTv3gFX8",
    videoFile: "hero.webm",
    aspectRatio: "landscape",
    featured: true,
  },
  {
    slug: "affinessence",
    title: "Affinessence",
    year: 2024,
    role: "Réalisation 3D",
    type: "3d",
    category: "3D",
    coverPlaceholder: "#14100E",
    description:
      "Pub 3D pour Affinessence. Installer le luxe sans en surjouer les codes.",
    videoUrl: "https://vimeo.com/1033824012",
    videoFile: "hero.webm",
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
    description:
      "Une série de portraits où l'orchidée prend la place du regard. Le visage s'efface, la fleur tient le cadre.",
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
      "Bordeaux la nuit, lumières flottantes et silhouettes en suspens. Une promenade qui finit par ressembler à un rêve.",
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
      "Une salle de bain bleue, captée dans l'isolement du soir. Tout y est immobile.",
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
      "Trois parcs traversés sur le même tempo. Les paysages qu'on regarde sans les voir, restitués un à un.",
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
      "Documenter une séance de shibari. Le lien comme écriture sur le corps, photographié sans détourner les yeux.",
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
      "Mode pop, latex, palettes saturées. La couleur poussée jusqu'au sucre, à la limite du soutenable.",
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
      "Une chambre, des draps, une pose tenue juste avant le geste. L'éditorial dans son moment d'attente.",
    imageFiles: [
      "P1001664-2_AVIF.avif",
      "P1001688-2_AVIF.avif",
      "P1001662_AVIF.avif",
      "P1001699-2_AVIF.avif",
      "P1001732_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
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
      "Une nymphe en couloir, entre deux portes, dans une lumière qui hésite. Fiction courte montée comme un rêve.",
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
      "Noir profond, blanc cassé. La photographie revenue à ses textures, sans concession à la couleur.",
    imageFiles: [
      "P1002222_AVIF.avif",
      "P1001913-3_AVIF.avif",
      "P1002247_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
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
      "L'herbe haute d'un été qui s'étire. Paysage minimal pour un souvenir qu'on n'attendait pas à garder.",
    imageFiles: [
      "P1002259-2_AVIF.avif",
      "P1002225_AVIF.avif",
      "P1002226_AVIF.avif",
    ],
    aspectRatio: "landscape",
    featured: true,
  },
];
