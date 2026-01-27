import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AllStudentAttendance } from "./attendanceService";

export const getStudentAttendance = createAsyncThunk(
  "attendances/getAllStudentAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AllStudentAttendance();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load attendance",
      );
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendances",
  initialState: {
    attendances: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getStudentAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
        state.error = null;
      })
      .addCase(getStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default attendanceSlice.reducer;
