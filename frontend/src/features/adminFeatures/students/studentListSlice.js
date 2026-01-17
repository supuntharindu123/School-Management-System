import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetStudents } from "./studentApi";

// Fetch all students
export const GetAllStudents = createAsyncThunk(
  "studentList/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetStudents();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load students"
      );
    }
  }
);

const studentListSlice = createSlice({
  name: "studentList",
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(GetAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default studentListSlice.reducer;
