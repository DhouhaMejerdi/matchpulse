import MatchPageClient from './MatchPageClient';

export default function MatchPage({ params }: { params: { id: string } }) {
  const { id } = params; // safe here on the server
  return <MatchPageClient id={id} />;
}