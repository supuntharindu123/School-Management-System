import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import TeacherDashboardPage from "../pages/TeacherDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import StudentListPage from "../pages/StudentListPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import GradeManagementPage from "../pages/GradeManagementPage";
import ClassManagementPage from "../pages/ClassManagementPage";
import SubjectManagementPage from "../pages/SubjectManagementPage";
import TeacherListPage from "../pages/TeacherListPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

export default function RouteConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          {/* Teacher (and other roles) */}
          <Route element={<AppLayout />}>
            <Route path="/teacher" element={<TeacherDashboardPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/grades" element={<GradeManagementPage />} />
            <Route path="/classes" element={<ClassManagementPage />} />
            <Route path="/subjects" element={<SubjectManagementPage />} />
            <Route path="/teachers" element={<TeacherListPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        {/* Errors */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
