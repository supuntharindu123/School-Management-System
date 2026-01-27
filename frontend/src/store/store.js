import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studentListReducer from "../features/adminFeatures/students/studentListSlice";
import yearReducer from "../features/year/yearSlice";
import gradeReducer from "../features/grade/gradeSlice";
import classReducer from "../features/class/classSlice";
import subjectReducer from "../features/subject/subjectSlice";
import teacherReducer from "../features/adminFeatures/teachers/teacherSlice";
import attendanceReducer from "../features/attendances/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentList: studentListReducer,
    years: yearReducer,
    grades: gradeReducer,
    classes: classReducer,
    subjects: subjectReducer,
    teachers: teacherReducer,
    attendances: attendanceReducer,
  },
});
