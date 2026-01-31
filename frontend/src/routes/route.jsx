import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherDashboardPage from "../pages/TeacherDashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import StudentListPage from "../pages/admin/StudentListPage";
import StudentProfilePage from "../pages/admin/StudentProfilePage";
import GradeManagementPage from "../pages/admin/GradeManagementPage";
import ClassManagementPage from "../pages/admin/ClassManagementPage";
import ClassDetailsPage from "../pages/admin/ClassDetailsPage";
import SubjectManagementPage from "../pages/admin/SubjectManagementPage";
import TeacherListPage from "../pages/admin/TeacherListPage";
import TeacherProfilePage from "../pages/admin/TeacherProfilePage";
// import AddStudentPage from "../pages/admin/AddStudentPage";
import GradeSummaryPage from "../pages/admin/GradeSummaryPage";
import StudentPromotionPage from "../pages/admin/StudentPromotionPage";
import ExamManagementPage from "../pages/admin/ExamManagementPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";
import AttendancePage from "../pages/admin/AttendancePage";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

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
            {/* <Route path="/students/add" element={<AddStudentPage />} /> */}
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/grades" element={<GradeManagementPage />} />
            <Route path="/grade-summary" element={<GradeSummaryPage />} />
            <Route path="/promotions" element={<StudentPromotionPage />} />
            <Route path="/classes" element={<ClassManagementPage />} />
            <Route path="/classes/:id" element={<ClassDetailsPage />} />
            <Route path="/subjects" element={<SubjectManagementPage />} />
            <Route path="/exams" element={<ExamManagementPage />} />
            <Route path="/teachers" element={<TeacherListPage />} />
            <Route path="/teachers/:id" element={<TeacherProfilePage />} />
            <Route path="/attendance" element={<AttendancePage />} />

            {/* teacher only */}

            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
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
