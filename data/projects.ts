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
    description:
      "A series exploring absence — the weight of empty rooms, skin that seems to hold its breath. Shot over six weeks in abandoned farmhouses outside Bordeaux, working with natural light only. The silence here is not peaceful; it is the silence of things that have stopped waiting.",
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
    description:
      "A study in physical form and editorial restraint. Commissioned for a Paris-based fashion house, the series treats the body as architecture — load-bearing, structural, indifferent to the garments it carries. Shot on medium format over three days in a Pigalle studio.",
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
    description:
      "Moulting architecture — buildings caught mid-transformation. Urban demolition and construction sites across Bordeaux and its banlieues, photographed at the precise moment between what a structure was and what it will become. Nothing here is finished.",
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
    description:
      "Threshold spaces for a luxury brand campaign. The brief demanded ambiguity — spaces that could be an arrival or a departure. The result was a set of images that refuse to commit to either. Corridors, lobbies, doorways. Stillness as a proposition.",
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
    description:
      "Images built from what is missing. A portrait series where the subject refuses to fully appear — out of frame, out of focus, turned away. Shot on medium format with long exposures in natural light. Published in AnOther Magazine, issue 45.",
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
    description:
      "Commercial work that refuses to look commercial. A collaboration that deliberately places the product in the periphery while the space asserts itself. The object becomes evidence of an environment, not its purpose.",
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
    description:
      "Made on the road between Bordeaux and Paris — exit ramps, rest areas, industrial parks, the overlooked periphery of movement. A first personal project. The highway as a place people pass through but never photograph. Shot over eight months on a compact.",
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
    description:
      "A 12-minute documentary following infrastructure maintenance workers through the underground networks of Bordeaux. Shot on 16mm and digital over four weeks. The city above never appears; everything happens in the dark, in the pipes, in the noise. Selected for Côté Court 2024.",
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
    description:
      "A winter campaign for a French outerwear brand. Six locations, seven days. The brief was silence and cold — two things that are actually the same thing photographed differently. The result is 90 seconds. It runs in-store across Europe.",
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
    description:
      "Single-take video essays on objects at rest. A table set for no one. A coat on a chair. Flowers past their point. The title is also the method — no cuts, no movement, only duration. Shown as a three-channel installation at La Base, Bordeaux.",
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
    description:
      "Do objects continue to exist when no one is looking? An editorial collaboration exploring the psychology of possession — rooms entered, objects examined, rooms left empty again. The camera as the last visitor.",
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
    description:
      "What the frame excludes defines what remains. A commercial that works by systematic absence — minimal on-screen presence, maximum atmospheric pressure. The product appears for four seconds across a two-minute film.",
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
    description:
      "A 7-minute loop of static, interference, and white noise treated as image. Signal and failure as the same material. Made during a week without internet, using analogue feedback loops and degraded VHS transfers. The piece runs continuously; there is no beginning or end.",
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
    description:
      "Photographs taken over a full year of the same windowsill — the same light, the same angle, different states of accumulation and decay. Dust, dead plants, forgotten objects, seasons. A slow project about the objects that stay when people leave.",
    images: 5,
    aspectRatio: "portrait",
  },
];
