import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import LoginPage from "../pages/LoginPage.jsx";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import UnauthorizedPage from "../pages/UnauthorizedPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="pt-16 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function RouteConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* Other protected pages can go here */}
        </Route>

        {/* Unauthorized & NotFound */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouteConfig;
