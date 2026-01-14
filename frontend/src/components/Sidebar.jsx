import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/school-logo.svg";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const dashboardLink = user && user.role === 0 ? "/admin" : "/teacher";

  const items = [
    {
      label: "Dashboard",
      to: dashboardLink,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 3.75a.75.75 0 0 1 .47.167l7.5 6.25a.75.75 0 1 1-.94 1.166L12 5.21 4.97 11.333a.75.75 0 0 1-.94-1.166l7.5-6.25A.75.75 0 0 1 12 3.75Z" />
          <path d="M4.5 10.5V19.5A1.5 1.5 0 0 0 6 21h3.75v-5.25h4.5V21H18a1.5 1.5 0 0 0 1.5-1.5V10.5L12 4.875 4.5 10.5Z" />
        </svg>
      ),
    },
    {
      label: "Students",
      to: "/students",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M7.5 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" />
          <path d="M3 20.25a7.5 7.5 0 1 1 15 0v.75H3v-.75Z" />
        </svg>
      ),
    },
    {
      label: "Teachers",
      to: "/teachers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M11.7 2.64a.75.75 0 0 1 .6 0l8.25 3.75a.75.75 0 0 1 0 1.36l-8.25 3.75a.75.75 0 0 1-.6 0L3.45 7.75a.75.75 0 0 1 0-1.36L11.7 2.64Z" />
          <path d="M4.5 10.5v3.375a4.125 4.125 0 0 0 8.25 0V10.5" />
        </svg>
      ),
    },
    {
      label: "Classes",
      to: "/classes",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75V9H3V6.75Z" />
          <path d="M3 12h18v5.25A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V12Z" />
        </svg>
      ),
    },
    {
      label: "Subjects",
      to: "/subjects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M6.75 4.5A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5h7.5A2.25 2.25 0 0 0 16.5 17.25V6.75A2.25 2.25 0 0 0 14.25 4.5h-7.5Z" />
          <path d="M18 7.5h.75A2.25 2.25 0 0 1 21 9.75V18a1.5 1.5 0 0 1-1.5 1.5H18V7.5Z" />
        </svg>
      ),
    },
    {
      label: "Settings",
      to: "/settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M10.5 2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.19a7.538 7.538 0 0 1 1.914.793l.842-.842a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1 0 1.06l-.842.842c.33.594.594 1.23.793 1.914h1.19a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.19a7.538 7.538 0 0 1-.793 1.914l.842.842a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0l-.842-.842a7.538 7.538 0 0 1-1.914.793v1.19a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.19a7.538 7.538 0 0 1-1.914-.793l-.842.842a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 0 1 0-1.06l.842-.842A7.538 7.538 0 0 1 6.84 13.5H5.65a.75.75 0 0 1-.75-.75v-1.5c0-.414.336-.75.75-.75h1.19a7.538 7.538 0 0 1 .793-1.914l-.842-.842a.75.75 0 0 1 0-1.06L7.85 4.38a.75.75 0 0 1 1.06 0l.842.842c.594-.33 1.23-.594 1.914-.793V2.25Z" />
          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      id="sidebar"
      className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] my-4 rounded-r-sm
      bg-gray-200 border-r border-gray-200
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      aria-label="Sidebar"
      aria-hidden={!isOpen}
    >
      {/* Brand
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <img src={logo} alt="School logo" className="h-7 w-7" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-neutral-900">
            School Management
          </p>
          <p className="-mt-0.5 text-xs text-neutral-600">Navigation</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={onClose}
            aria-label="Hide sidebar"
            className="rounded px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            Hide
          </button>
        </div>
      </div> */}
      {/* Nav */}
      <nav className="p-2 space-y-1 pt-6">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-3 text-md font-semibold ${
                active
                  ? "bg-teal-600 text-white"
                  : "text-neutral-800 hover:bg-gray-100"
              }`}
            >
              {/* Active indicator */}
              {/* <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r ${
                  active
                    ? "bg-teal-600"
                    : "bg-transparent group-hover:bg-gray-300"
                }`}
              /> */}
              <span
                className={`text-neutral-600 group-hover:text-teal-700 ${
                  active ? "text-white" : " "
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-3 border-t border-gray-200 pt-2">
          <button className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600">
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
