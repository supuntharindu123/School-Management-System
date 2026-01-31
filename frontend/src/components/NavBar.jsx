import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import logo from "../assets/logo.png";

export default function NavBar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifications = [
    { id: 1, text: "Staff meeting at 3 PM in Room 201.", time: "Today" },
    { id: 2, text: "Submit gradebook export by Friday.", time: "2d" },
    { id: 3, text: "New student added to Grade 8 - A.", time: "1h" },
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
    if (!nameOrEmail) return "US";
    const base = String(nameOrEmail).trim();
    if (base.includes(" ")) {
      const [a, b] = base.split(" ");
      return `${a?.[0] ?? ""}${b?.[0] ?? ""}`.toUpperCase() || "US";
    }
    if (base.includes("@")) return base[0]?.toUpperCase() ?? "U";
    return base.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setNotifOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutAction());
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-cyan-950 border-b border-cyan-800 text-white">
      <div className="mx-auto  h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-white hover:text-cyan-200 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path d="M3.75 6.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm0 6h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm0 6h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z" />
            </svg>
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <img
              src={logo}
              alt="School Management System logo"
              className="h-8 w-auto ml-10"
            />
            <span className="hidden sm:block text-2xl font-extrabold ml-5">
              Rajapaksha Central College
            </span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3" ref={menuRef}>
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setNotifOpen((v) => !v);
                setOpen(false);
              }}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/30 bg-transparent text-white hover:border-white hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 2.25a4.5 4.5 0 0 0-4.5 4.5v1.17c0 .546-.217 1.07-.603 1.456L5.03 11.243A2.25 2.25 0 0 0 4.5 12.84V15a.75.75 0 0 0 .75.75h13.5A.75.75 0 0 0 19.5 15v-2.16c0-.597-.237-1.17-.659-1.593l-1.866-1.866a2.25 2.25 0 0 1-.603-1.456V6.75A4.5 4.5 0 0 0 12 2.25Z" />
                <path d="M8.25 16.5a3.75 3.75 0 0 0 7.5 0h-7.5Z" />
              </svg>

              {/* Badge */}
              <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-semibold text-cyan-900">
                {notifications.length}
              </span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg z-50 focus:outline-none">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    Notifications
                  </p>
                  <span className="text-xs rounded bg-cyan-50 text-cyan-700 px-2 py-1 border border-cyan-200">
                    {notifications.length}
                  </span>
                </div>
                <ul className="max-h-64 overflow-auto py-1">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-gray-600">
                      No notifications
                    </li>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-gray-900">{n.text}</p>
                        <span className="text-xs text-gray-500">{n.time}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              aria-label="Profile"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent pl-1 pr-3 py-1.5 text-sm text-white hover:border-white hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-xs font-semibold">
                {getInitials(user?.username || user?.email || "User")}
              </span>

              <div className="hidden sm:flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold text-white">
                  {user?.username || "User"}
                </span>
                <span className="text-xs text-cyan-100">
                  {getRoleLabel(user?.role)}
                </span>
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-semibold">
                      {getInitials(user?.username || user?.email || "User")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user?.username || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email || "no-email"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    Role:{" "}
                    <span className="font-medium">
                      {getRoleLabel(user?.role)}
                    </span>
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
