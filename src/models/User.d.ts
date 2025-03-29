export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  permissions: number;
  blocked: boolean;
  last_connected: string;
  roles: Role[];
  groups: Group[];
}
