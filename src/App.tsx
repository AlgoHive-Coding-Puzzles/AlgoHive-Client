import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ResetPasswordPage from "@/app/shared/pages/reset-password/ResetPasswordPage";
import HowToPlayPage from "@/app/shared/pages/how-to-play/HowToPlayPage";
import AccountPage from "@/app/shared/pages/account/AccountPage";
import SupportPage from "@/app/shared/pages/support/SupportPage";
import LicensePage from "@/app/shared/pages/license/LicensePage";
import LoginPage from "@/app/shared/pages/login/LoginPage";
import Users from "@/app/shared/pages/home/HomePage";

import ProtectedRoutes from "@/app/shared/components/ProtectedRoutes";

// Lazy load Admin component to improve load time
const Admin = lazy(() => import("./app/admin/pages/AdminLayout"));

import PuzzleInputPage from "@/app/player/pages/puzzle-input/PuzzleInputPage";
import CompetitionPage from "@/app/player/pages/competition/CompetitionPage";
import LeaderboardPage from "@/app/player/pages/leaderboard/LeaderboardPage";
import PuzzlePage from "@/app/player/pages/puzzle/PuzzlePage";

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
      <Route path="/how-to-play" element={<HowToPlayPage />} />
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
