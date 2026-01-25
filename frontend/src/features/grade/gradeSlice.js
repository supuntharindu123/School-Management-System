import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGrades } from "./gradeService";

export const getAllGrades = createAsyncThunk(
  "grades",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getGrades();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load grades",
      );
    }
  },
);

const gradeSlice = createSlice({
  name: "grades",
  initialState: {
    grades: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload;
        state.error = null;
      })
      .addCase(getAllGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default gradeSlice.reducer;
