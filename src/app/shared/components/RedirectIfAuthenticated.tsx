import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@contexts/AuthContext";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RedirectIfAuthenticated = ({
  children,
  redirectTo = "/",
}: RedirectIfAuthenticatedProps) => {
  const { checkAuth } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isUserConnected = async () => {
      try {
        const response = await checkAuth();
        setIsConnected(response);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    isUserConnected();
  }, [checkAuth]);

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  // If the user is authenticated, redirect to the home page
  return isConnected ? <Navigate to={redirectTo} /> : <>{children}</>;
};

export default RedirectIfAuthenticated;
