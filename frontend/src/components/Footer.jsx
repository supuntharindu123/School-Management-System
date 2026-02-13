import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Rajapaksha Central College
            </p>
            <p className="text-xs text-slate-500">
              © {year} School management system. All rights reserved.
            </p>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-xs font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              Privacy policy
            </a>
            <a
              href="#terms"
              className="text-xs font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              Terms of service
            </a>
            <a
              href="#support"
              className="text-xs font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
            >
              Help & support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
