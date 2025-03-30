// Export service classes
export { AuthService } from "./AuthService";
export { UsersService } from "./UsersService";
export { CompetitionsService } from "./CompetitionsService";
export { GroupsService } from "./GroupsService";
export { RolesService } from "./RolesService";
export { ScopesService } from "./ScopesService";
export { BaseService } from "./BaseService";

// Export service instances
export { authService } from "./AuthService";
export { usersService } from "./UsersService";
export { competitionsService } from "./CompetitionsService";
export { groupsService } from "./GroupsService";
export { rolesService } from "./RolesService";
export { scopesService } from "./ScopesService";

// Export the service manager
export { ServiceManager } from "./ServiceManager";

// Export response types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from "../models/ApiResponse";
