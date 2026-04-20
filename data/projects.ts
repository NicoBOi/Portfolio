export type ProjectType = "photo" | "video" | "experimental";

export interface Project {
  slug: string;
  title: string;
  year: number;
  role: string;
  type: ProjectType;
  category: string;
  coverPlaceholder: string; // CSS color for placeholder
  images?: number; // count of photo images (placeholders)
  videoUrl?: string;
  featured?: boolean;
  aspectRatio?: "landscape" | "portrait" | "square";
}

export const projects: Project[] = [
  // ── PHOTO ────────────────────────────────────────────
  {
    slug: "silence-study-i",
    title: "Silence Study I",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#D8D4CF",
    images: 5,
    featured: true,
    aspectRatio: "portrait",
  },
  {
    slug: "corpus",
    title: "Corpus",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Editorial",
    coverPlaceholder: "#C8C2BB",
    images: 5,
    featured: true,
    aspectRatio: "landscape",
  },
  {
    slug: "architectures-mues",
    title: "Architectures Mues",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#BDB8B2",
    images: 5,
    aspectRatio: "portrait",
  },
  {
    slug: "liminal",
    title: "Liminal",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Commercial",
    coverPlaceholder: "#E0DAD3",
    images: 5,
    aspectRatio: "landscape",
  },
  {
    slug: "fragments",
    title: "Fragments d'une Absence",
    year: 2023,
    role: "Photography",
    type: "photo",
    category: "Editorial",
    coverPlaceholder: "#CAC5BE",
    images: 5,
    aspectRatio: "portrait",
  },
  {
    slug: "matter-over-form",
    title: "Matter Over Form",
    year: 2024,
    role: "Photography",
    type: "photo",
    category: "Commercial",
    coverPlaceholder: "#D2CFC9",
    images: 5,
    aspectRatio: "landscape",
  },
  {
    slug: "threshold",
    title: "Threshold",
    year: 2022,
    role: "Photography",
    type: "photo",
    category: "Personal",
    coverPlaceholder: "#C0BBB5",
    images: 5,
    aspectRatio: "portrait",
  },

  // ── VIDEO ────────────────────────────────────────────
  {
    slug: "veins-of-the-city",
    title: "Veins of the City",
    year: 2024,
    role: "Direction · DOP",
    type: "video",
    category: "Documentary",
    coverPlaceholder: "#2A2A2A",
    videoUrl: "#",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    slug: "hiver",
    title: "Hiver",
    year: 2024,
    role: "Direction",
    type: "video",
    category: "Commercial",
    coverPlaceholder: "#1C1C1C",
    videoUrl: "#",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    slug: "still-life",
    title: "Still Life",
    year: 2023,
    role: "Direction · Edit",
    type: "video",
    category: "Personal",
    coverPlaceholder: "#242424",
    videoUrl: "#",
    aspectRatio: "landscape",
  },
  {
    slug: "object-permanence",
    title: "Object Permanence",
    year: 2023,
    role: "Direction · DOP",
    type: "video",
    category: "Editorial",
    coverPlaceholder: "#1A1A1A",
    videoUrl: "#",
    aspectRatio: "landscape",
  },
  {
    slug: "negative-space",
    title: "Negative Space",
    year: 2023,
    role: "Direction",
    type: "video",
    category: "Commercial",
    coverPlaceholder: "#222222",
    videoUrl: "#",
    aspectRatio: "landscape",
  },

  // ── EXPERIMENTAL ─────────────────────────────────────
  {
    slug: "white-noise",
    title: "White Noise",
    year: 2024,
    role: "Direction · Concept",
    type: "experimental",
    category: "Personal",
    coverPlaceholder: "#F5F5F5",
    videoUrl: "#",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    slug: "entropy",
    title: "Entropy",
    year: 2023,
    role: "Photography · Concept",
    type: "experimental",
    category: "Personal",
    coverPlaceholder: "#E8E8E8",
    images: 5,
    aspectRatio: "portrait",
  },
];
