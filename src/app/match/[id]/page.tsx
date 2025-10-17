import Link from 'next/link';

export default function MatchPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <section style={{ padding: '24px 0' }}>
      <p className="small"><Link href="/">← Back to matches</Link></p>
      <h1 className="h1" style={{ marginBottom: 8 }}>Match #{id}</h1>
      <div className="card" style={{ padding: 16 }}>
        <p className="p">Timeline tab will render here (Day 5).</p>
      </div>
    </section>
  );
}