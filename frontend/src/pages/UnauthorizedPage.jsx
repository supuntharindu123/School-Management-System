import React from "react";
import { Link } from "react-router-dom";
import LinkComponent from "../components/CommonElements/Link";

export default function UnauthorizedPage() {
  return (
    <main className="bg-gray-200 px-4 py-20 flex items-center justify-center h-screen">
      <section className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl px-12 py-24 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-neutral-800">
          You don’t have permission to access this page.
        </p>
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
