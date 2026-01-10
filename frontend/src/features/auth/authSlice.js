import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Login } from "./authApi";
import { getToken, removeToken, setToken } from "../../services/tokenservice";

export const login = createAsyncThunk(
  "auth/login",
  async (logindata, error) => {
    try {
      const res = await Login(logindata);
      return res;
    } catch (err) {
      return error.rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getToken(),
    loading: false,
    error: null,
    isAuthenticated: !!getToken(),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token, username, email, role } = action.payload;
        setToken(token);
        state.user = { username, email, role };
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
