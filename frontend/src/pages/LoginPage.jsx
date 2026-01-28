import React from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const res = await dispatch(login(credentials));
    console.log(res);
    if (res.type === "auth/login/fulfilled") {
      if (res.payload.role == 1) {
        navigate("/teacher/dashboard");
      } else if (res.payload.role == 0) {
        navigate("/admin");
      }
    }
  };

  return (
    <main
      className="min-h-screen bg-gray-200 flex items-center justify-center px-4"
      aria-label="Login page"
    >
      <LoginForm onLogin={handleLogin} />
    </main>
  );
}
