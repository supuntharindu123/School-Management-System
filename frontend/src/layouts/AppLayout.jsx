import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* top navigation bar */}
      <NavBar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <div className="flex flex-1">
        {/* navigation sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* main content container */}
        <main
          className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          {/* page content section */}
          <div className="p-6 flex-1">
            <div className="mx-auto max-w-full">
              <Outlet />
            </div>
          </div>

          {/* footer positioned at the bottom of the content area */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
