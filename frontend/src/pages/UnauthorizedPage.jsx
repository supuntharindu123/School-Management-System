import React from "react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <main className="bg-gray-200 px-4 py-20 flex items-center justify-center h-screen">
      <section className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl px-12 py-24 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-neutral-800">
          You don’t have permission to access this page.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            className="inline-flex justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Go to Login
          </Link>
          <Link
            to="/admin"
            className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Go to Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
