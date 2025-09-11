import { Navigate } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
