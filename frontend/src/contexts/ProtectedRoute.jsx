import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;

  if (!auth || !auth.token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
