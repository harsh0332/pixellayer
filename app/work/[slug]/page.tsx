import { notFound } from "next/navigation";
import { ALL_PROJECTS, pageMetadata } from "@/lib/studio";
import { ProjectDetail } from "@/components/studio/StudioPages";
export function generateStaticParams() {
  return ALL_PROJECTS.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = ALL_PROJECTS.find((x) => x.slug === slug);
  if (!p) notFound();
  return pageMetadata(`${p.name} — Project`, p.line, `/work/${slug}`);
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!ALL_PROJECTS.some((x) => x.slug === slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
