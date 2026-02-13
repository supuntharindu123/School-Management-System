import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import StudentListPage from "../pages/admin/StudentListPage";
import StudentProfilePage from "../pages/admin/StudentProfilePage";
import ClassManagementPage from "../pages/admin/ClassManagementPage";
import ClassDetailsPage from "../pages/admin/ClassDetailsPage";
import SubjectManagementPage from "../pages/admin/SubjectManagementPage";
import TeacherListPage from "../pages/admin/TeacherListPage";
import TeacherProfilePage from "../pages/admin/TeacherProfilePage";
import StudentPromotionPage from "../pages/admin/StudentPromotionPage";
import ExamManagementPage from "../pages/admin/ExamManagementPage";
import ExamDetailsPage from "../pages/admin/ExamDetailsPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";
import AttendancePage from "../pages/admin/AttendancePage";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
// import SubjectDetailsPage from "../pages/admin/SubjectDetailsPage";
import GuestPage from "../pages/GuestPage";
import ExamAssignPage from "../pages/admin/AssignGradeSubjectForExam";
import ExamGradeDetailsPage from "../pages/admin/ExamGradeDetailsPage";
import SubjectAssignmentDetailsPage from "../pages/teacher/SubjectAssignmentDetailsPage";

export default function RouteConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<GuestPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          {/* Teacher (and other roles) */}
          <Route element={<AppLayout />}>
            <Route path="/students" element={<StudentListPage />} />
            {/* <Route path="/students/add" element={<AddStudentPage />} /> */}
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/promotions" element={<StudentPromotionPage />} />
            <Route path="/classes" element={<ClassManagementPage />} />
            <Route path="/classes/:id" element={<ClassDetailsPage />} />
            <Route path="/subjects" element={<SubjectManagementPage />} />
            <Route path="/exams" element={<ExamManagementPage />} />
            <Route path="/exams/:id" element={<ExamDetailsPage />} />
            <Route path="/teachers" element={<TeacherListPage />} />
            <Route path="/teachers/:id" element={<TeacherProfilePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            {/* <Route path="/subject/:id" element={<SubjectDetailsPage />} /> */}
            <Route path="/exams/:id/assign" element={<ExamAssignPage />} />
            <Route
              path="/exams/:examId/grades/:gradeId"
              element={<ExamGradeDetailsPage />}
            />
            <Route
              path="/teacher/subject-assignments/:id"
              element={<SubjectAssignmentDetailsPage />}
            />

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
