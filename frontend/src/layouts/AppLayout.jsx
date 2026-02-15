import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const { user } = useSelector((state) => state.auth);

  // Sidebar only exists for Admin (Role 0)
  const isAdmin = user?.role === 0;

  // Set initial state: Admin starts with sidebar open, others have no sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(isAdmin);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navigation bar */}
      <NavBar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <div className="flex flex-1">
        {/* Navigation sidebar - Only renders for Admin */}
        {isAdmin && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content container */}
        <main
          className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${
            isAdmin && isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          {/* Page content section */}
          <div className="p-6 flex-1">
            <div className="mx-auto max-w-full">
              <Outlet />
            </div>
          </div>

          {/* Footer at the bottom */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
