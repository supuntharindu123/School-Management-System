import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import ConfirmDialog from "./ConfirmDialog";
import logo from "../assets/logo.png";

export default function NavBar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menuRef = useRef(null);

  const isAdmin = user?.role === 0;

  // Dynamic path for the logo
  const homeLink =
    user?.role === 0
      ? "/admin"
      : user?.role === 1
        ? "/teacher/dashboard"
        : "/student/dashboard";

  const getRoleLabel = (role) => {
    switch (role) {
      case 0:
        return "Administrator";
      case 1:
        return "Teacher";
      case 2:
        return "Student";
      default:
        return "Guest";
    }
  };

  const getInitials = (name) => {
    if (!name) return "Us";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-cyan-950 border-b border-cyan-800 text-white">
      <div className="mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Toggle Button - Only visible to Admins */}
          {isAdmin && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-white hover:bg-white/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}

          <Link to={homeLink} className="flex items-center gap-3">
            <img src={logo} alt="School logo" className="h-9 w-auto" />
            <span className="hidden lg:block text-xl font-bold tracking-normal">
              Rajapaksha Central College
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 p-1 pr-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-sm capitalize">
                {getInitials(user?.username || "User")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none capitalize">
                  {user?.username || "Guest user"}
                </p>
                <p className="text-[10px] text-cyan-300 mt-1 leading-none">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Confirm logout"
        message="Are you sure you want to end your session?"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={async () => {
          await dispatch(logoutAction());
          navigate("/login");
        }}
      />
    </nav>
  );
}
