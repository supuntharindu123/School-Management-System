import React from "react";
import { Link } from "react-router-dom";
import LinkComponent from "../components/CommonElements/Link";

export default function NotFoundPage() {
  return (
    <main className="bg-gray-200 px-4 py-10 flex items-center justify-center h-screen">
      <section className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl px-12 text-center py-24">
        <h1 className="text-4xl font-bold text-neutral-900">404</h1>
        <p className="mt-2 text-sm text-neutral-800">Page not found.</p>
        <div className="mt-6 flex flex-col gap-3">
          <LinkComponent to="/" variant="primary">
            Go to Login
          </LinkComponent>

          <LinkComponent to="/admin" variant="secondary">
            Go to Admin
          </LinkComponent>
        </div>
      </section>
    </main>
  );
}
