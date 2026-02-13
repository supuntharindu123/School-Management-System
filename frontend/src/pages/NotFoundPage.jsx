import React from "react";
import LinkComponent from "../components/CommonElements/Link";

export default function NotFoundPage() {
  return (
    <main className="bg-slate-50 px-4 flex items-center justify-center min-h-screen">
      <section className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
        {/* visual indicator */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-cyan-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>

        <h2 className="mt-2 text-lg font-bold text-slate-800">
          Page not found
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Please
          check the url or return to the dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <LinkComponent to="/" variant="primary">
            Back to dashboard
          </LinkComponent>

          <LinkComponent to="/support" variant="secondary">
            Report a bug
          </LinkComponent>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">Rajapaksha Central College</p>
        </div>
      </section>
    </main>
  );
}
