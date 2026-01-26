import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllClasses } from "./classService";

export const getClasses = createAsyncThunk(
  "classes/getAllClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getClasses();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load classes",
      );
    }
  },
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default classSlice.reducer;
