export default function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="card" style={{ padding: 16, textAlign: 'center' }}>
      <p className="h2" style={{ margin: 0 }}>{title}</p>
      {hint ? <p className="small" style={{ marginTop: 8 }}>{hint}</p> : null}
    </div>
  );
}
