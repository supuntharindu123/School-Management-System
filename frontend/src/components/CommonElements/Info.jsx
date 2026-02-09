export default function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 shadow-sm">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value ?? "-"}</p>
    </div>
  );
}
