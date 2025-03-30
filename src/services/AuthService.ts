import { BaseService } from "./BaseService";
import { User, Role, Group } from "@/models";

interface LoginResponse {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  permissions: number;
  blocked: boolean;
  last_connected: string;
  roles: Role[];
  groups: Group[];
}

interface AuthCheckResponse {
  user: User & {
    user_id: string;
  };
  valid: boolean;
  hasDefaultPassword: boolean;
}

export class AuthService extends BaseService {
  /** [POST] /auth/login */
  public async login(
    email: string,
    password: string,
    remember_me: boolean
  ): Promise<LoginResponse> {
    return this.post<LoginResponse>("/auth/login", {
      email,
      password,
      remember_me,
    });
  }

  /** [POST] /auth/logout */
  public async logout(): Promise<void> {
    return this.post<void>("/auth/logout", {});
  }

  /** [POST] /auth/reset-password */
  public async resetPassword(password: string, token: string): Promise<void> {
    return this.post<void>("/auth/reset-password", { password, token });
  }

  /** [POST] /auth/request-reset */
  public async requestPasswordReset(email: string): Promise<void> {
    return this.post<void>("/auth/request-reset", { email });
  }

  /** [GET] /auth/me */
  public async checkAuth(): Promise<AuthCheckResponse> {
    return this.get<AuthCheckResponse>("/auth/check");
  }
}

// Create singleton instance
export const authService = new AuthService();
