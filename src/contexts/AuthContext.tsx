import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { User } from "../models/User";
import { ServiceManager } from "../services";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasDefaultPassword: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasDefaultPassword, setHasDefaultPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const response = await ServiceManager.auth.login(
        email,
        password,
        rememberMe
      );

      setUser({
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        permissions: response.permissions,
        blocked: response.blocked,
        last_connected: response.last_connected,
        roles: response.roles,
        groups: response.groups,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        console.error("Login error", error);
        throw new Error("Connection error");
      }
    }
  };

  const logout = async () => {
    try {
      // Call the API to remove the cookie
      await ServiceManager.auth.logout();
      setUser(null);
      setHasDefaultPassword(false);
    } catch (error) {
      setUser(null);
      setHasDefaultPassword(false);
      console.error("Cookie is missing, user is already logged out", error);
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // The cookie will be sent automatically with the request
      const response = await ServiceManager.auth.checkAuth();

      if (response.valid === false) {
        setUser(null);
        return false;
      }

      setHasDefaultPassword(response.hasDefaultPassword);

      setUser({
        id: response.user.user_id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        permissions: response.user.permissions,
        blocked: response.user.blocked,
        last_connected: response.user.last_connected,
        roles: response.user.roles,
        groups: response.user.groups,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        console.error("Auth check failed", error);
      }
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname != "/login") {
      checkAuth();
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    hasDefaultPassword,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
