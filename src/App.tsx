import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import LoginPage from "./pages/login/login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ActivePageProvider } from "./contexts/ActivePageContext";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import { isStaff } from "./utils/permissions";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Users from "./pages/home/Home";
import AccountPage from "./pages/account/Account";
import HowToPlay from "./pages/how-to-play/how-to-play";

// Lazy load Admin component to improve load time
const Admin = lazy(() => import("./pages/admin/Admin"));

// Main router component that handles authentication logic
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/" element={<Users />} />
      <Route
        path="/staff_portal"
        element={
          isStaff(user) ? (
            <Suspense>
              <ProtectedRoutes target="staff">
                <ActivePageProvider>
                  <Admin />
                </ActivePageProvider>
              </ProtectedRoutes>
            </Suspense>
          ) : (
            <Users />
          )
        }
      />

      <Route path="/account" element={<AccountPage />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
