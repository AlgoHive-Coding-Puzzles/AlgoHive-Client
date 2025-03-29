import { BaseService } from "./BaseService";
import { User } from "../models/User";

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export class AuthService extends BaseService {
  /** [POST] /auth/login */
  public async login(email: string, password: string): Promise<LoginResponse> {
    return this.post<LoginResponse>("/auth/login", { email, password });
  }

  /** [POST] /auth/logout */
  public async logout(): Promise<void> {
    return this.post<void>("/auth/logout", {});
  }

  /** [POST] /auth/reset-password */
  public async resetPassword(email: string): Promise<void> {
    return this.post<void>("/auth/reset-password", { email });
  }

  /** [POST] /auth/confirm-reset-password */
  public async confirmResetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    return this.post<void>("/auth/confirm-reset-password", {
      token,
      password: newPassword,
    });
  }

  /** [GET] /auth/me */
  public async checkAuth(): Promise<User> {
    return this.get<User>("/auth/me");
  }
}

// Create singleton instance
export const authService = new AuthService();
