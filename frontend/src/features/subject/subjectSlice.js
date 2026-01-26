import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSubjects } from "./subjectService";

export const getAllSubjects = createAsyncThunk(
  "subjects /getAllSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSubjects();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load subjects",
      );
    }
  },
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        state.error = null;
      })
      .addCase(getAllSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default subjectSlice.reducer;
