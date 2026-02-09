export default function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      <p className="text-xs text-neutral-600">{title}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
