export default function Info({ label, value }) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-cyan-100 hover:bg-white hover:shadow-md hover:shadow-cyan-900/5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-cyan-600 transition-colors">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value ?? "—"}</p>
    </div>
  );
}
