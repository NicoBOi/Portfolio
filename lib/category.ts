import type { ProjectType } from "@/data/projects";

// Geometric markers per discipline. Stays inside the B&W system but lets
// the eye sort projects at a glance: ● photo, ▶ film, ◆ 3D.
export const CATEGORY_MARK: Record<ProjectType, string> = {
  photo: "●",
  video: "▶",
  "3d": "◆",
};
