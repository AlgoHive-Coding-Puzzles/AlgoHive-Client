import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/login/login";
import Admin from "./pages/admin/Admin";

import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { ActivePageProvider } from "./contexts/ActivePageContext";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute target="staff">
              <ActivePageProvider>
                <Admin />
              </ActivePageProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
