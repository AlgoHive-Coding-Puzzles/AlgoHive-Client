import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@contexts/AuthContext";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated = ({
  children,
}: RedirectIfAuthenticatedProps) => {
  const { checkAuth } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const isUserConnected = async () => {
      const repsonse = await checkAuth();
      setIsConnected(repsonse);
    };

    isUserConnected();
  }, [checkAuth]);

  // If the user is authenticated, redirect to the home page
  return isConnected ? <Navigate to="/" /> : <>{children}</>;
};

export default RedirectIfAuthenticated;
