import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

import { useAuth } from "@contexts/AuthContext";

interface ProtectedRoutesProps {
  children?: React.ReactNode;
  target?: "staff" | "participant" | "all";
}

const ProtectedRoutes = ({
  children,
  target = "participant",
}: ProtectedRoutesProps) => {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only check authentication once when the component is mounted
    if (!initialCheckDone) {
      const verifyAuth = async () => {
        await checkAuth();
        setInitialCheckDone(true);
      };
      verifyAuth();
    }
  }, [checkAuth, initialCheckDone]);

  // Show loading state only during initial authentication check
  if (isLoading && !initialCheckDone) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect if user is not staff
  if (
    target === "staff" &&
    user &&
    user.groups &&
    user.groups.length > 0 &&
    (user.roles == null || user.roles.length === 0)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect if user is not a participant
  if (target === "participant" && user && user.roles && user.roles.length > 0) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children are provided, render them directly
  if (children) {
    return <>{children}</>;
  }

  // Otherwise, use Outlet for nested routes
  return <Outlet />;
};

export default ProtectedRoutes;
