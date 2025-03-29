import { BaseService } from "./BaseService";
import { User } from "../models/User";

export class UsersService extends BaseService {
  /** [GET] /user/ */
  public async fetchAll(): Promise<User[]> {
    return this.get<User[]>("/user/");
  }

  /** [GET] /user/roles?roles= */
  public async fetchUsersFromRoles(roles: string[]): Promise<User[]> {
    return this.get<User[]>(`/user/roles?roles=${roles.join(",")}`);
  }

  /** [GET] /user/groups/{groupID} */
  public async fetchUsersFromGroup(groupID: string): Promise<User[]> {
    return this.get<User[]>(`/user/groups/${groupID}`);
  }

  public async createStaff(
    firstName: string,
    lastName: string,
    email: string,
    roles: string[]
  ): Promise<User> {
    return this.post<User>("/user/roles", {
      first_name: firstName,
      last_name: lastName,
      email,
      roles,
    });
  }

  // [POST] /user/groups
  public async create(
    firstName: string,
    lastName: string,
    email: string,
    groupID: string
  ): Promise<User> {
    return this.post<User>("/user/groups", {
      first_name: firstName,
      last_name: lastName,
      email,
      groups: [groupID],
    });
  }

  /** [DELETE] /user/{userID} */
  public async remove(userID: string): Promise<void> {
    return this.delete<void>(`/user/${userID}`);
  }

  /** [DELETE] /user/bulk */
  public async removeBulk(usersIDs: string[]): Promise<void> {
    return this.delete<void>("/user/bulk", { user_ids: usersIDs });
  }

  /** [PUT] /user/profile/password */
  public async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    return this.put<void>("/user/profile/password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  /** [PUT] /user/profile */
  public async update(
    firstName: string,
    lastName: string,
    email: string
  ): Promise<User> {
    return this.put<User>("/user/profile", {
      first_name: firstName,
      last_name: lastName,
      email,
    });
  }

  /** [GET] /user/{userID} */
  public async fetchUserByID(userID: string): Promise<User> {
    return this.get<User>(`/user/${userID}`);
  }

  /** [PUT] /user/{userID} */
  public async updateUser(
    userID: string,
    first_name: string,
    last_name: string,
    email: string,
    roles_ids: string[],
    groups_ids: string[]
  ): Promise<User> {
    return this.put<User>(`/user/${userID}`, {
      first_name,
      last_name,
      email,
      roles_ids,
      groups_ids,
    });
  }

  /** [PUT] /user/block/{userID} */
  public async toggleBlock(userID: string): Promise<User> {
    return this.put<User>(`/user/block/${userID}`);
  }

  /** [POST] /user/group/{groupID}/import */
  public async importUsersFromXLSX(
    groupeID: string,
    file: File
  ): Promise<User[]> {
    const formData = new FormData();
    formData.append("file", file);
    return this.postMultipartFormData<User[]>(
      `/user/group/${groupeID}/import`,
      formData
    );
  }

  /** [PUT] /user/resetpass/{userID} */
  public async resetTargetUserPassword(userID: string): Promise<void> {
    return this.put<void>(`/user/resetpass/${userID}`);
  }

  /** [POST] /support */
  public async sendSupportRequest(
    name: string,
    email: string,
    subject: string,
    message: string,
    issue_type: string
  ): Promise<void> {
    return this.post<void>("/support", {
      name,
      email,
      subject,
      message,
      issue_type,
    });
  }
}

// Create singleton instance
export const usersService = new UsersService();
