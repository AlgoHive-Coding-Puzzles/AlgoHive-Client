import { BaseService } from "./BaseService";
import { Role } from "../models/Role";

export class RolesService extends BaseService {
  /** [GET] /roles/ */
  public async fetchAll(): Promise<Role[]> {
    return this.get<Role[]>("/roles/");
  }

  /** [POST] /roles/ */
  public async create(
    name: string,
    permission: number,
    scopes_ids: string[]
  ): Promise<Role> {
    return this.post<Role>("/roles/", {
      name,
      permission,
      scopes_ids,
    });
  }

  /** [GET] /roles/{roleID} */
  public async fetchRoleById(roleID: string): Promise<Role> {
    return this.get<Role>(`/roles/${roleID}`);
  }

  /** [PUT] /roles/{roleID} */
  public async update(
    roleID: string,
    name: string,
    permission: number,
    scopes_ids: string[]
  ): Promise<Role> {
    return this.put<Role>(`/roles/${roleID}`, {
      name,
      permission,
      scopes_ids,
    });
  }

  /** [DELETE] /roles/{roleID} */
  public async remove(roleID: string): Promise<void> {
    return this.delete<void>(`/roles/${roleID}`);
  }

  /** [GET] /user/roles */
  public async fetchUserRoles(): Promise<Role[]> {
    return this.get<Role[]>("/user/roles");
  }
}

// Create singleton instance
export const rolesService = new RolesService();
