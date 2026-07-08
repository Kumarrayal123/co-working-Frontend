import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");

      // Allow access if user is logged in OR admin is logged in
      // Admins can book cabins too
      if (token && (user || admin)) {
        setIsAuthenticated(true);
      } else {
        // Not logged in - redirect to login
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;
