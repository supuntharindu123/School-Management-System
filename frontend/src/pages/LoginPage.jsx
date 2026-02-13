import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";

// components
import LoginForm from "../components/LoginForm";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

// assets
import logoPng from "../assets/logo.png";
import SchoolBg from "../assets/school01.jpg";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state
  const [success, setSuccess] = useState({ open: false, message: "" });
  const [error, setError] = useState({ open: false, message: "" });

  const handleLogin = async (credentials) => {
    // reset alerts
    setError({ open: false, message: "" });
    setSuccess({ open: false, message: "" });

    try {
      const payload = await dispatch(login(credentials)).unwrap();

      setSuccess({ open: true, message: "Login Successful!" });

      // role-based redirection
      const role = Number(payload?.role);
      const routes = {
        0: "/admin",
        1: "/teacher/dashboard",
        2: "/student/dashboard",
      };

      // navigate to specific route or home if role is unknown
      setTimeout(() => {
        navigate(routes[role] || "/");
      }, 1000);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Login Failed. Please Try Again.";
      setError({ open: true, message });
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center relative overflow-hidden"
      aria-label="Login Page"
      style={{ backgroundImage: `url(${SchoolBg})` }}
    >
      {/* background overlay */}
      <div className="absolute inset-0 bg-cyan-950/70 backdrop-blur-[3px] z-0"></div>

      {/* ================= header ================= */}
      <header className="fixed top-0 inset-x-0 z-50 h-20 bg-cyan-900/90 backdrop-blur-md shadow-2xl border-b border-white/10 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-950 via-cyan-900 to-cyan-800 opacity-90"></div>
        </div>

        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between relative z-10">
          {/* brand branding */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <img
                src={logoPng}
                alt="School Logo"
                className="relative h-12 w-12 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xl font-serif font-bold tracking-tight text-white leading-tight">
                Rajapaksha Central College
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-300 mt-1 opacity-90">
                Government School – Sri Lanka
              </p>
            </div>
          </Link>

          {/* navigation actions */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-cyan-50 hover:bg-white/15 hover:text-white transition-all duration-300"
          >
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
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Back To Home
          </button>
        </div>
      </header>

      {/* ================= login form section ================= */}
      <section className="mt-20 flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <LoginForm onLogin={handleLogin} />

          <p className="mt-8 text-center text-cyan-100/60 text-xs font-medium tracking-wide">
            Authorized Personnel Only • Secure Portal Access
          </p>
        </div>
      </section>

      {/* ================= alerts ================= */}
      <div className="relative z-50">
        {success.open && (
          <SuccessAlert
            isOpen={success.open}
            message={success.message}
            onClose={() => setSuccess({ open: false, message: "" })}
          />
        )}
        {error.open && (
          <ErrorAlert
            isOpen={error.open}
            message={error.message}
            onClose={() => setError({ open: false, message: "" })}
          />
        )}
      </div>
    </main>
  );
}
