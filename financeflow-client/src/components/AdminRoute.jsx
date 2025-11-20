import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch {
    return <Navigate to="/login" replace />;
  }

  // 🔥 ВАЖНО: тут проверяем роль
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
