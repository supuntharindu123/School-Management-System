import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import ConfirmDialog from "./ConfirmDialog";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import logo from "../assets/logo.png";

export default function NavBar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [busyLogout, setBusyLogout] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState({ open: false, msg: "" });
  const [logoutError, setLogoutError] = useState({ open: false, msg: "" });
  const menuRef = useRef(null);

  const notifications = [
    { id: 1, text: "Staff meeting at 3 pm in room 201.", time: "Today" },
    { id: 2, text: "Submit gradebook export by friday.", time: "2 days ago" },
    { id: 3, text: "New student added to grade 8 - a.", time: "1 hour ago" },
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case 0:
        return "Administrator";
      case 1:
        return "Teacher";
      case 2:
        return "Student";
      default:
        return "Unauthorized";
    }
  };

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "Us";
    const base = String(nameOrEmail).trim();
    if (base.includes(" ")) {
      const [a, b] = base.split(" ");
      return `${a?.[0] ?? ""}${b?.[0] ?? ""}`;
    }
    return base.slice(0, 2);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-cyan-950 border-b border-cyan-800 text-white">
      <div className="mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
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

          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="School logo" className="h-9 w-auto" />
            <span className="hidden lg:block text-xl font-bold tracking-normal">
              Rajapaksha Central College
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4" ref={menuRef}>
          {/* notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setOpen(false);
              }}
              className="relative p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-cyan-400"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <span className="text-sm font-bold text-slate-800">
                    Notifications
                  </span>
                  <span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                    {notifications.length} New
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {n.text}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* user profile */}
          <div className="relative">
            <button
              onClick={() => {
                setOpen(!open);
                setNotifOpen(false);
              }}
              className="flex items-center gap-3 p-1 pr-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-sm">
                {getInitials(user?.username || "User")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none">
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
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
        confirmLabel="Logout"
        cancelLabel="Stay logged in"
        busy={busyLogout}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={async () => {
          try {
            setBusyLogout(true);
            await dispatch(logoutAction());
            navigate("/");
          } catch (err) {
            setLogoutError({ open: true, msg: "Failed to sign out safely." });
          } finally {
            setBusyLogout(false);
          }
        }}
      />
    </nav>
  );
}
