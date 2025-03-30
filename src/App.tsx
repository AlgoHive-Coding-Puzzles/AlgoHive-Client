import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ResetPasswordPage from "@shared/pages/reset-password/reset-password";
import HowToPlay from "@shared/pages/how-to-play/how-to-play";
import AccountPage from "@shared/pages/account/Account";
import SupportPage from "@shared/pages/support/support";
import LicensePage from "@shared/pages/license/license";
import LoginPage from "@shared/pages/login/login";
import Users from "@shared/pages/home/Home";

import ProtectedRoutes from "@shared/ProtectedRoutes";

// Lazy load Admin component to improve load time
const Admin = lazy(() => import("./app/admin/pages/Admin"));

import PuzzleInputPage from "@player/pages/puzzle_input/puzzle_input";
import CompetitionPage from "@player/pages/competition/competition";
import LeaderboardPage from "@player/pages/leaderboard/leaderboard";
import PuzzlePage from "@player/pages/puzzle/puzzle";

import { isStaff } from "@utils/permissions";

import { AuthProvider, useAuth } from "@contexts/AuthContext";
import { ActivePageProvider } from "@contexts/ActivePageContext";

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
