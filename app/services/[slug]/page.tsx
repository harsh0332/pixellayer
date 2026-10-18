import { notFound } from "next/navigation";
import { STUDIO_SERVICES, getService } from "@/lib/services";
import { pageMetadata } from "@/lib/studio";
import { ServiceDetail } from "@/components/studio/StudioPages";
export function generateStaticParams() {
  return STUDIO_SERVICES.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return pageMetadata(service.title, service.intro, `/services/${slug}`);
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
