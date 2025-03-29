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
import SupportPage from "./pages/support/support";
import CompetitionPage from "./pages/competition/competition";
import PuzzlePage from "./pages/puzzle/puzzle";
import PuzzleInputPage from "./pages/puzzle_input/puzzle_input";
import ResetPasswordPage from "./pages/reset-password/reset-password";
import LicensePage from "./pages/license/license";
import LeaderboardPage from "./pages/leaderboard/leaderboard";

// Lazy load Admin component to improve load time
const Admin = lazy(() => import("./pages/admin/Admin"));

// Main router component that handles authentication logic
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/" element={<Users />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/license" element={<LicensePage />} />

      {/* Staff portal with its own protection */}
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

      {/* All authenticated user protected routes */}
      <Route element={<ProtectedRoutes target="all" />}>
        <Route path="/account" element={<AccountPage />} />
        <Route
          path="/competitions/:competition_id?"
          element={<CompetitionPage />}
        />
        <Route
          path="/competition/:competition_id/puzzle/:puzzle_index/input"
          element={<PuzzleInputPage />}
        />
        <Route
          path="/competition/:competition_id/puzzle/:puzzle_index"
          element={<PuzzlePage />}
        />
        <Route
          path="/competition/:competition_id/leaderboard"
          element={<LeaderboardPage />}
        />
      </Route>
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
