import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardIcon = () => (
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
);

const UserIcon = () => (
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
);

const AcademicIcon = () => (
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
);

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const menuConfig = [
    { label: "Dashboard", to: "/admin", icon: <DashboardIcon /> },
    { label: "Students", to: "/students", icon: <UserIcon /> },
    { label: "Teachers", to: "/teachers", icon: <AcademicIcon /> },
    { label: "Classes", to: "/classes", icon: <UserIcon /> },
    { label: "Subjects", to: "/subjects", icon: <AcademicIcon /> },
    { label: "Exams", to: "/exams", icon: <DashboardIcon /> },
    { label: "Attendance", to: "/attendance", icon: <AcademicIcon /> },
    { label: "Student promotion", to: "/promotions", icon: <DashboardIcon /> },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] 
      bg-cyan-950 border-r border-cyan-800/50 text-white
      transform transition-all duration-300 ease-in-out
      ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
    >
      <div className="h-full overflow-y-auto py-6 px-3">
        <div className="mb-4 px-4 text-[10px] font-bold text-slate-500 tracking-normal">
          Menu management
        </div>
        <div className="space-y-1">
          {menuConfig.map((item) => {
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
                  className={`${active ? "text-white" : "text-slate-400 group-hover:text-cyan-400"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
