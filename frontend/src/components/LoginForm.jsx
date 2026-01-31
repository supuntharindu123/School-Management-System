import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      className="w-full max-w-md bg-white rounded-xl p-8 shadow-stone-300 shadow-xl"
      role="region"
      aria-labelledby="login-title"
    >
      <img
        src={logo}
        alt="School Management System logo"
        className="mx-auto h-12 w-auto"
      />
      <h1
        id="login-title"
        className="my-3 text-3xl font-bold text-neutral-900 text-center"
      >
        Rajapaksha Central <br />
        College
      </h1>
      <p className="mt-1 text-sm text-neutral-600 text-center">
        Sign in to continue
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-800"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-800"
          >
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-16 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-xs font-medium text-cyan-600 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full">
          <Button
            type={"submit"}
            onClick={handleSubmit}
            label="Sign in"
            bgcolor={"w-full bg-cyan-700"}
          />
        </div>

        {/* Below actions */}
        <div className="mt-4 space-y-2 text-center">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
          >
            Forgot password?
          </a>
          <p className="text-xs text-neutral-600">
            Need access? Contact your administrator.
          </p>
        </div>
      </form>
    </section>
  );
}
