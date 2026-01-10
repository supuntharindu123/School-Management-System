import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className=" bg-white border-t border-gray-200 h-16">
      <div className="mx-auto max-w-7xl px-4 h-16">
        <div className="flex h-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-neutral-800">
            © {year} School Management System. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-neutral-800 hover:text-teal-600">
              Privacy
            </a>
            <a href="#" className="text-neutral-800 hover:text-teal-600">
              Terms
            </a>
            <a href="#" className="text-neutral-800 hover:text-teal-600">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
