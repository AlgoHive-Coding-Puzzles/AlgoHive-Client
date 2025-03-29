// Export service classes
export { AuthService } from "./authService";
export { UsersService } from "./usersService";
export { CompetitionsService } from "./competitionsService";
export { GroupsService } from "./groupsService";
export { RolesService } from "./rolesService";
export { ScopesService } from "./scopesService";
export { BaseService } from "./BaseService";

// Export service instances
export { authService } from "./authService";
export { usersService } from "./usersService";
export { competitionsService } from "./competitionsService";
export { groupsService } from "./groupsService";
export { rolesService } from "./rolesService";
export { scopesService } from "./scopesService";

// Export the service manager
export { ServiceManager } from "./ServiceManager";

// Export response types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from "../models/ApiResponse";
