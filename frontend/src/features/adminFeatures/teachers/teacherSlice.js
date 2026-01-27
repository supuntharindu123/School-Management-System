import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teacherListAPI } from "./teacherService";

export const getTeachers = createAsyncThunk(
  "teachers/getAllTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await teacherListAPI();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load teachers",
      );
    }
  },
);

const teacherSlice = createSlice({
  name: "teachers",
  initialState: {
    teachers: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
        state.error = null;
      })
      .addCase(getTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default teacherSlice.reducer;
