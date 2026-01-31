import React, { useState } from "react";

export default function Alert({
  variant = "info",
  title,
  message,
  dismissible = true,
  onClose,
  className = "",
}) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const styles = getStyles(variant);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className={`${styles.iconWrap}`}>{styles.icon}</span>
        <div className="flex-1 min-w-0">
          {title && <p className={`${styles.title}`}>{title}</p>}
          {message && <p className={`${styles.message}`}>{message}</p>}
        </div>
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss alert"
            onClick={handleClose}
            className={`${styles.closeBtn}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function getStyles(variant) {
  switch (variant) {
    case "success":
      return {
        container:
          "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2",
        iconWrap:
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700",
        title: "text-sm font-medium text-emerald-900",
        message: "text-sm text-emerald-800",
        closeBtn:
          "ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM10.31 14.69 7.97 12.35a.75.75 0 1 1 1.06-1.06l1.28 1.28 4.66-4.66a.75.75 0 0 1 1.06 1.06l-5.19 5.19a.75.75 0 0 1-1.06 0Z" />
          </svg>
        ),
      };
    case "error":
      return {
        container: "rounded-lg border border-rose-200 bg-rose-50 px-3 py-2",
        iconWrap:
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700",
        title: "text-sm font-medium text-rose-900",
        message: "text-sm text-rose-800",
        closeBtn:
          "ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-rose-200 text-rose-700 hover:bg-rose-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm0 5.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V8.25A.75.75 0 0 1 12 7.5Zm0 9a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z" />
          </svg>
        ),
      };
    case "warning":
      return {
        container: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2",
        iconWrap:
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700",
        title: "text-sm font-medium text-amber-900",
        message: "text-sm text-amber-800",
        closeBtn:
          "ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-amber-200 text-amber-700 hover:bg-amber-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M11.47 3.84a1.125 1.125 0 0 1 2.06 0l8.25 16.5A1.125 1.125 0 0 1 20.812 22.5H3.188A1.125 1.125 0 0 1 2.22 20.34l8.25-16.5Zm.78 4.41a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0V8.25ZM12 18a1.125 1.125 0 1 0 0-2.25A1.125 1.125 0 0 0 12 18Z" />
          </svg>
        ),
      };
    default:
      return {
        container: "rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2",
        iconWrap:
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700",
        title: "text-sm font-medium text-cyan-900",
        message: "text-sm text-cyan-800",
        closeBtn:
          "ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-200 text-cyan-700 hover:bg-cyan-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Zm-.75 5.25a.75.75 0 0 1 1.5 0v3.75a.75.75 0 0 1-1.5 0V9Zm.75 7.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z" />
          </svg>
        ),
      };
  }
}
