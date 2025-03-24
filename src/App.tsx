import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import LoginPage from "./pages/login/login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ActivePageProvider } from "./contexts/ActivePageContext";
import { isStaff } from "./utils/permissions";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Users from "./pages/home/Home";
import AccountPage from "./pages/account/Account";
import HowToPlay from "./pages/how-to-play/how-to-play";
import CompetitionPage from "./pages/competition/competition";
import PuzzlePage from "./pages/puzzle/puzzle";
import PuzzleInputPage from "./pages/puzzle_input/puzzle_input";

// Lazy load Admin component to improve load time
const Admin = lazy(() => import("./pages/admin/Admin"));

// Main router component that handles authentication logic
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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

      <Route
        path="/account"
        element={
          <ProtectedRoutes target="all">
            <AccountPage />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/competitions/:competition_id?"
        element={
          <ProtectedRoutes target="all">
            <CompetitionPage />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/puzzle/:competition_id/quest/:quest_number/input"
        element={
          <ProtectedRoutes target="all">
            <PuzzleInputPage />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/puzzle/:competition_id/quest/:quest_number"
        element={
          <ProtectedRoutes target="all">
            <PuzzlePage />
          </ProtectedRoutes>
        }
      />

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
