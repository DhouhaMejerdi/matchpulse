export default function TeamPage({ params }: { params: { id: string } }) {
  return (
    <section style={{ padding: '24px 0' }}>
      <h1 className="h1">Team: {params.id}</h1>
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <p className="p">Team overview and fixtures will appear here.</p>
      </div>
    </section>
  );
}