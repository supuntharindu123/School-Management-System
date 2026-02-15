import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function StudentRoute() {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role != 2) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
