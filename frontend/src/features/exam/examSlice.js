import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getExams } from "./examService";

export const getAllExams = createAsyncThunk(
  "exams/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getExams();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load exams",
      );
    }
  },
);

const examSlice = createSlice({
  name: "exams",
  initialState: {
    exams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
        state.error = null;
      })
      .addCase(getAllExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default examSlice.reducer;
