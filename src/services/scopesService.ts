import { BaseService } from "./BaseService";
import { Scope } from "../models/Scope";

export class ScopesService extends BaseService {
  /** [GET] /scopes/ */
  public async fetchAll(): Promise<Scope[]> {
    return this.get<Scope[]>("/scopes/");
  }

  /** [POST] /scopes/ */
  public async create(
    name: string,
    description: string,
    catalogs_ids: string[]
  ): Promise<Scope> {
    return this.post<Scope>("/scopes/", {
      name,
      description,
      catalogs_ids,
    });
  }

  /** [GET] /scopes/{scopeID} */
  public async fetchByID(scopeID: string): Promise<Scope> {
    return this.get<Scope>(`/scopes/${scopeID}`);
  }

  /** [PUT] /scopes/{scopeID} */
  public async update(
    scopeID: string,
    name: string,
    description: string,
    catalogs_ids: string[]
  ): Promise<Scope> {
    return this.put<Scope>(`/scopes/${scopeID}`, {
      name,
      description,
      catalogs_ids,
    });
  }

  /** [DELETE] /scopes/{scopeID} */
  public async remove(scopeID: string): Promise<void> {
    return this.delete<void>(`/scopes/${scopeID}`);
  }

  /** [GET] /scopes/me */
  public async fetchAllFromUser(): Promise<Scope[]> {
    return this.get<Scope[]>("/scopes/me");
  }

  /** [GET] /scopes/roles?roles= */
  public async fetchScopesFromRoles(roles: string[]): Promise<Scope[]> {
    return this.get<Scope[]>(`/scopes/roles?roles=${roles.join(",")}`);
  }
}

// Create singleton instance
export const scopesService = new ScopesService();
