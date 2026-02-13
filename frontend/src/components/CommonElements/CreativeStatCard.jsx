import React from "react";

export default function CreativeStatCard({
  title,
  subtitle,
  stats = [],
  icon,
}) {
  const DefaultIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M11.584 2.25a.75.75 0 0 1 .732 0l9 5.25a.75.75 0 0 1 0 1.299l-9 5.25a.75.75 0 0 1-.732 0l-9-5.25a.75.75 0 0 1 0-1.299l9-5.25ZM2.458 11.25l1.042.608 7.25 4.23 7.25-4.23 1.042-.608a.75.75 0 0 1 .75 1.299l-8.625 5.031a.75.75 0 0 1-.75 0l-8.625-5.031a.75.75 0 0 1 .75-1.299Zm0 4.5l1.042.608 7.25 4.23 7.25-4.23 1.042-.608a.75.75 0 0 1 .75 1.299l-8.625 5.031a.75.75 0 0 1-.75 0l-8.625-5.031a.75.75 0 0 1 .75-1.299Z" />
    </svg>
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-700 p-[1px] shadow-xl shadow-cyan-900/20">
      {/* internal glow and glass layer */}
      <div className="relative rounded-[23px] bg-slate-900/10 p-5 backdrop-blur-xl transition-all group-hover:bg-slate-900/5">
        {/* decorative glass blobs */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10">
          <header className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-md">
              {icon || <DefaultIcon />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight drop-shadow-sm">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] font-medium text-cyan-50/70">
                  {subtitle}
                </p>
              )}
            </div>
          </header>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white shadow-sm transition-all hover:bg-white/10"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-100/60">
                  {s.label}
                </p>
                <p className="mt-1 text-xl font-bold leading-none tracking-tight">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* glass shine effect */}
        <div className="absolute inset-0 z-0 rounded-[23px] bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
}
