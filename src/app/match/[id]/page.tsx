import MatchPageClient from './MatchPageClient';

// In Next 15, params is a Promise in RSC. Await it.
export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MatchPageClient id={id} />;
}
