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
      aria-hidden="true"
    >
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h9.5A1.75 1.75 0 0 1 16 6.75v.5c0 .966-.784 1.75-1.75 1.75H6.5v6.25c0 .69.56 1.25 1.25 1.25h8.75A1.75 1.75 0 0 0 18.75 14V7.75A2.75 2.75 0 0 0 16 5H4.75C3.784 5 3 5.784 3 6.75v.5C3 8.216 3.784 9 4.75 9H6v8.25A2.75 2.75 0 0 0 8.75 20h9.5A2.75 2.75 0 0 0 21 17.25V9.5a.75.75 0 0 0-1.5 0v7.75c0 .69-.56 1.25-1.25 1.25h-9.5A1.25 1.25 0 0 1 7.5 17.25V9H4.75C3.784 9 3 8.216 3 7.25v-.5Z" />
    </svg>
  );
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 via-emerald-500 to-cyan-600 p-1 shadow-[0_10px_25px_-10px_rgba(13,148,136,0.5)]">
      <div className="relative rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
              {icon || <DefaultIcon />}
            </span>
            <div>
              <p className="text-sm font-semibold text-white drop-shadow-sm">
                {title}
              </p>
              {subtitle ? (
                <p className="text-xs text-white/80 drop-shadow-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-inner"
              >
                <p className="text-[11px] text-white/80">{s.label}</p>
                <p className="text-xl font-semibold leading-6">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
