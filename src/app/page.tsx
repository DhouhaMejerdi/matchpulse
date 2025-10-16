import Image from "next/image";

export default function Home() {
  return (
    <section style={{ padding: '24px 0' }}>
      <h1 className="h1" style={{ marginBottom: 8 }}>
        Today’s Matches
      </h1>
      <p className="small">
        Start here — we’ll render FixtureList in Sprint 1 Day 4.
      </p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <p className="p">Scaffold complete. Next: header nav, routes, and data mocks.</p>
      </div>
    </section>
  );
}
