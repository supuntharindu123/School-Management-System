import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/school-logo.svg";

export default function NavBar({ onToggleSidebar }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-gray-300 border-b border-gray-200">
      <div className="mx-auto  h-full px-4 flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-gray-800 hover:text-teal-600 "
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
            className="flex items-center gap-2 font-semibold text-gray-900"
          >
            <img
              src={logo}
              alt="School Management System logo"
              className="h-8 w-auto"
            />
            <span className="hidden sm:block text-lg">
              School Management System
            </span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-800 hover:border-teal-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
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
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Profile"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 py-1.5 text-sm text-gray-800 hover:border-teal-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-semibold">
              AD
            </span>

            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-sm font-semibold text-gray-800">
                Admin User
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
