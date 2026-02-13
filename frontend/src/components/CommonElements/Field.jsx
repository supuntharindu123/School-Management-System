export default function Field({ label, error, children, optional }) {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <label className="block text-sm font-bold text-slate-700 tracking-tight">
          {label}
          {optional && (
            <span className="ml-1.5 text-[11px] font-medium text-slate-400 italic">
              (optional)
            </span>
          )}
        </label>
      </div>

      <div className="relative">{children}</div>

      {/* error message container with height transition potential */}
      {error && (
        <div className="px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
