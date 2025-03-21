import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated = ({
  children,
}: RedirectIfAuthenticatedProps) => {
  const { user } = useAuth();

  // If the user is authenticated, redirect to the home page
  return user ? <Navigate to="/" /> : <>{children}</>;
};

export default RedirectIfAuthenticated;
