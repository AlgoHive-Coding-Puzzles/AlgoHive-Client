import { BaseService } from "./BaseService";
import { Group } from "../models/Group";

export class GroupsService extends BaseService {
  /** [GET] /groups/scope/{scopeID} */
  public async fetchGroupsFromScope(scopeID: string): Promise<Group[]> {
    return this.get<Group[]>(`/groups/scope/${scopeID}`);
  }

  /** [POST] /groups/ */
  public async create(
    scopeID: string,
    name: string,
    description: string
  ): Promise<void> {
    return this.post<void>("/groups/", {
      scope_id: scopeID,
      name,
      description,
    });
  }

  /** [GET] /groups/{groupID} */
  public async fetchByID(groupID: string): Promise<Group> {
    return this.get<Group>(`/groups/${groupID}`);
  }

  /** [PUT] /groups/{groupID} */
  public async update(
    groupID: string,
    name: string,
    description: string
  ): Promise<void> {
    return this.put<void>(`/groups/${groupID}`, {
      name,
      description,
    });
  }

  /** [DELETE] /groups/{groupID} */
  public async remove(groupID: string): Promise<void> {
    return this.delete<void>(`/groups/${groupID}`);
  }

  /** [GET] /groups/me */
  public async fetchAllUserPermissions(): Promise<Group[]> {
    return this.get<Group[]>("/groups/me");
  }

  /** [GET] /user/groups */
  public async fetchUserGroups(): Promise<Group[]> {
    return this.get<Group[]>("/user/groups");
  }
}

// Create singleton instance
export const groupsService = new GroupsService();
