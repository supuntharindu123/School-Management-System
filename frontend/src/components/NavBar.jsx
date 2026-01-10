import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Admin", to: "/admin" },
    { label: "Students", to: "#" },
    { label: "Teachers", to: "#" },
    { label: "Classes", to: "#" },
    { label: "Reports", to: "#" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gray-300 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 font-semibold text-neutral-900"
          >
            <span
              className="inline-block h-3 w-3 rounded-full bg-teal-600"
              aria-hidden="true"
            />
            <span>School Management System</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm text-neutral-800 hover:text-teal-600 font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notification button */}
            <button
              type="button"
              aria-label="Open notifications"
              className="relative rounded-full border border-gray-200 bg-white p-2 text-neutral-800 hover:text-teal-600 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
              </svg>
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-teal-600 ring-2 ring-white"
              />
            </button>

            {/* Profile button */}
            <button
              type="button"
              aria-label="Open profile menu"
              className="rounded-full border border-gray-200 bg-white p-2 text-neutral-800 hover:text-teal-600 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden rounded-lg border border-gray-200 bg-white p-2 text-neutral-800 hover:text-teal-600 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-2">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded px-2 py-1 text-sm text-neutral-800 hover:text-teal-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
