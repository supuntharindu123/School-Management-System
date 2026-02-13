import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const dashboardLink =
    user?.role === 0
      ? "/admin"
      : user?.role === 1
        ? "/teacher/dashboard"
        : user?.role === 2
          ? "/student/dashboard"
          : "/";

  const isActive = (to) =>
    typeof to === "string" &&
    (location.pathname === to || location.pathname.startsWith(`${to}/`));

  const mainItems = [
    {
      label: "Dashboard",
      to: dashboardLink,
      icon: (
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
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
  ];

  const managementItems = [
    {
      label: "Students",
      to: "/students",
      icon: (
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
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
    },
    {
      label: "Attendance",
      to: "/attendance",
      icon: (
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
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      ),
    },
    {
      label: "Teachers",
      to: "/teachers",
      icon: (
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
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.425 4.708 5.25 5.25 0 0 0 3.926 7.244c.66.154 1.319.314 1.982.475m11.996-12.427a50.636 50.636 0 0 1 2.425 4.708 5.25 5.25 0 0 1-3.926 7.244c-.66.154-1.319.314-1.982.475m12-12.427a48.62 48.62 0 0 0-16.232 0M12 12.75l1.25 1.25"
          />
        </svg>
      ),
    },
    {
      label: "Classes",
      to: "/classes",
      icon: (
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
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15"
          />
        </svg>
      ),
    },
    {
      label: "Subjects",
      to: "/subjects",
      icon: (
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
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
    {
      label: "Exams",
      to: "/exams",
      icon: (
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
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75"
          />
        </svg>
      ),
    },
    {
      label: "Student promotion",
      to: "/promotions",
      icon: (
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
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m9-6l4.5 4.5m0 0l-4.5 4.5M21 15H7.5"
          />
        </svg>
      ),
    },
  ];

  const renderLink = (item) => {
    const active = isActive(item.to);
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClose}
        className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          active
            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        <span
          className={`${active ? "text-white" : "text-slate-400 group-hover:text-cyan-400"} transition-colors`}
        >
          {item.icon}
        </span>
        {item.label}
      </Link>
    );
  };

  return (
    <aside
      id="sidebar"
      className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] 
      bg-cyan-950 border-r border-cyan-800/50 text-white
      transform transition-all duration-300 ease-in-out
      ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto py-6 px-3 custom-scrollbar">
        {/* main section */}
        <div className="space-y-1 mb-8">{mainItems.map(renderLink)}</div>

        {/* management section */}
        <div>
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Management
          </p>
          <div className="space-y-1">{managementItems.map(renderLink)}</div>
        </div>
      </div>
    </aside>
  );
}
