import React from "react";
import LinkComponent from "../components/CommonElements/Link";

export default function UnauthorizedPage() {
  return (
    <main className="bg-slate-50 px-4 flex items-center justify-center min-h-screen">
      <section className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
        {/* visual indicator */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          You do not have the necessary permissions to view this page. If you
          believe this is an error, please contact your administrator.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <LinkComponent to="/" variant="primary">
            Back to home
          </LinkComponent>

          <LinkComponent to="/support" variant="secondary">
            Contact support
          </LinkComponent>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">Rajapaksha Central College</p>
        </div>
      </section>
    </main>
  );
}
