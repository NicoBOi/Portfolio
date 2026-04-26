import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import LandingExperience from "@/components/home/LandingExperience";

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
  const discipline =
    project.type === "photo" ? "Photographie" : project.type === "3d" ? "Motion 3D" : "Film";
  const description =
    project.description ??
    `${project.title} — ${project.category}. ${discipline} par Nicolas Sempere, ${project.year}.`;
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

  // Render the same shell as the landing, but with the project pre-activated
  // on the server. Bookmarkable, crawlable (generateMetadata above covers OG),
  // and hydrates into the exact same in-page UX the user would see after
  // clicking a project from the landing.
  return <LandingExperience initialSlug={slug} />;
}
