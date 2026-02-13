import React, { useState } from "react";
import logo from "../assets/logo.png";
import Button from "./CommonElements/Button";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  return (
    <section
      className="w-full max-w-md bg-white rounded-2xl p-10 shadow-2xl shadow-slate-200 border border-slate-100"
      role="region"
      aria-labelledby="login-title"
    >
      <div className="text-center">
        <img
          src={logo}
          alt="School logo"
          className="mx-auto h-16 w-auto mb-4"
        />
        <h1
          id="login-title"
          className="text-2xl font-extrabold text-slate-900 leading-tight"
        >
          Rajapaksha Central <br /> College
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Sign in to your account
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {/* email field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-tight ml-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all duration-200"
          />
        </div>

        {/* password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-tight"
            >
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-white transition-all"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* submit action */}
        <Button
          type="submit"
          label="Sign in"
          bgcolor="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl shadow-lg shadow-cyan-900/10 transition-all active:scale-[0.98]"
        />

        <p className="text-center text-xs text-slate-500 font-medium pt-2">
          Don't have an account?{" "}
          <span className="text-slate-900">Contact administrator</span>
        </p>
      </form>
    </section>
  );
}
