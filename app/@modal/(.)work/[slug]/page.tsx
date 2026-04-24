import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import PhotoProject from "@/components/project/PhotoProject";
import VideoProject from "@/components/project/VideoProject";
import ProjectModal from "@/components/project/ProjectModal";

export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.indexOf(project);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  const body =
    project.type === "video" || project.videoUrl ? (
      <VideoProject project={project} prev={prev} next={next} mode="modal" />
    ) : (
      <PhotoProject project={project} prev={prev} next={next} mode="modal" />
    );

  return <ProjectModal title={project.title}>{body}</ProjectModal>;
}
