import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const handleLogin = (credentials) => {
    // UI-only: no backend call here.
    // eslint-disable-next-line no-console
    console.log("Login submitted", credentials);
  };

  return (
    <main
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      aria-label="Login page"
    >
      <section
        className="w-full max-w-md bg-white shadow-sm rounded-xl p-8"
        role="region"
        aria-labelledby="login-title"
      >
        <h1 id="login-title" className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-600">Sign in to continue</p>
        <div className="mt-6">
          <LoginForm onLogin={handleLogin} />
        </div>
      </section>
    </main>
  );
}
