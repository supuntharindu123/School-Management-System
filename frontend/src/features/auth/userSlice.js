// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { Me } from "./authApi";
// import { getUser, setUser } from "../../services/tokenservice";

// export const loadUser = createAsyncThunk("user/loadUser", async (_, error) => {
//   try {
//     const res = await Me();
//     return res;
//   } catch (err) {
//     return error.rejectWithValue(err.response.data);
//   }
// });

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     loading: false,
//     error: null,
//     user: getUser() || null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loadUser.fulfilled, (state, action) => {
//         state.loading = false;
//         const { username, email, role, teacherId, studentId } = action.payload;
//         const user = {
//           username,
//           email,
//           role,
//           teacherId: teacherId ?? null,
//           studentId: studentId ?? null,
//         };

//         setUser(user);
//         state.user = user;
//       })
//       .addCase(loadUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//       });
//   },
// });

// export default userSlice.reducer;
