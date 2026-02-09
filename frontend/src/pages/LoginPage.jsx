import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "../components/LoginForm";
import { Link, useNavigate } from "react-router-dom"; // Added Link import
import { login } from "../features/auth/authSlice";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import Button from "../components/CommonElements/Button";
import logoPng from "../assets/logo.png";
import School02 from "../assets/school01.jpg";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState({ open: false, message: "" });
  const [error, setError] = useState({ open: false, message: "" });

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (credentials) => {
    // Reset alerts before attempting login
    setError({ open: false, message: "" });
    setSuccess({ open: false, message: "" });

    try {
      const payload = await dispatch(login(credentials)).unwrap();
      console.log("Login payload:", payload);

      setSuccess({ open: true, message: "Login successful!" });

      const role = Number(payload?.role);
      if (role === 1) {
        navigate("/teacher/dashboard");
      } else if (role === 0) {
        navigate("/admin");
      } else if (role === 2) {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("Login error:", err);
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Login failed. Please try again.";
      setError({ open: true, message });
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center relative overflow-hidden"
      aria-label="Login page"
      style={{ backgroundImage: `url(${School02})` }}
    >
      <div className="absolute inset-0 bg-cyan-900/60 backdrop-blur-[2px] z-0"></div>

      {/* ================= HEADER (Exact Replica of NavBar Style) ================= */}
      <header className="fixed top-0 inset-x-0 z-50 h-20 bg-cyan-900 shadow-lg border-b border-cyan-800 text-white transition-all duration-300">
        {/* Creative Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950 via-cyan-900 to-cyan-900 opacity-90"></div>
          {/* Glow Effect */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between relative z-10">
          {/* LEFT SIDE: Brand */}
          <div className="flex items-center gap-4">
            {/* Note: Sidebar toggle removed because user isn't logged in yet */}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow behind logo */}
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <img
                  src={logoPng}
                  alt="School logo"
                  className="relative h-11 w-11 transition-transform duration-500 group-hover:rotate-6 drop-shadow-md"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xl font-serif font-bold tracking-tight text-white leading-none">
                  Rajapaksha Central College
                </p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-cyan-200 mt-1 opacity-80">
                  Government School – Sri Lanka
                </p>
              </div>
            </Link>
          </div>

          {/* RIGHT SIDE: Navigation Actions */}
          <div>
            {/* "Home" button styled to fit the header theme */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-full border border-cyan-700/50 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Home
            </button>
          </div>
        </div>
      </header>
      {/* ================= End Header ================= */}

      <section className="mt-20 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative z-10">
        <LoginForm onLogin={handleLogin} />
      </section>

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
