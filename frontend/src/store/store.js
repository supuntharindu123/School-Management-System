import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studentListReducer from "../features/adminFeatures/students/studentListSlice";
import yearReducer from "../features/year/yearSlice";
import gradeReducer from "../features/grade/gradeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentList: studentListReducer,
    years: yearReducer,
    grades: gradeReducer,
  },
});
