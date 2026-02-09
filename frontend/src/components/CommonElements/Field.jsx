export default function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}
