import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import PhotoProject from "@/components/project/PhotoProject";
import VideoProject from "@/components/project/VideoProject";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = project.title;
  const description =
    project.description ??
    `${project.title} — ${project.category}, ${project.year}. Photographie par Nicolas Sempere.`;
  const url = `/work/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} — Nicolas Sempere`,
      description,
      siteName: "Nicolas Sempere",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Nicolas Sempere`,
      description,
    },
  };
}

export default async function ProjectPage({
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

  if (project.type === "video" || project.videoUrl) {
    return <VideoProject project={project} prev={prev} next={next} />;
  }

  return <PhotoProject project={project} prev={prev} next={next} />;
}
