import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studentListReducer from "../features/adminFeatures/students/studentListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studentList: studentListReducer,
  },
});
