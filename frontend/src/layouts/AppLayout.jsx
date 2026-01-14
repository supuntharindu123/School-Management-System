import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <NavBar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(true)} />

      <main
        className={`pt-16 transition-all duration-300 min-h-screen
        ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
}
