import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getYears } from "./yearService";

export const getAllYears = createAsyncThunk(
  "years/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getYears();
      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load years",
      );
    }
  },
);

const yearSlice = createSlice({
  name: "years",
  initialState: {
    years: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllYears.fulfilled, (state, action) => {
        state.loading = false;
        state.years = action.payload;
        state.error = null;
      })
      .addCase(getAllYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default yearSlice.reducer;
