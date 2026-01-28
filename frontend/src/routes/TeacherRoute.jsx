import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function TeacherRoute() {
  const { user } = useSelector((state) => state.auth);

  if (user || user.role != 1) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
