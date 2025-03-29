import { UsersService, usersService } from "./usersService";
import {
  CompetitionsService,
  competitionsService,
} from "./competitionsService";
import { GroupsService, groupsService } from "./groupsService";
import { RolesService, rolesService } from "./rolesService";
import { ScopesService, scopesService } from "./scopesService";
import { AuthService, authService } from "./authService";
import { catalogsService, CatalogsService } from "./catalogsService";

/**
 * Service manager provides centralized access to all service instances
 * and enables dependency injection (particularly useful for testing)
 */
export class ServiceManager {
  // Default instances
  private static _authService: AuthService = authService;
  private static _usersService: UsersService = usersService;
  private static _competitionsService: CompetitionsService =
    competitionsService;
  private static _catalogsService: CatalogsService = catalogsService;
  private static _groupsService: GroupsService = groupsService;
  private static _rolesService: RolesService = rolesService;
  private static _scopesService: ScopesService = scopesService;

  // Getters
  static get auth(): AuthService {
    return this._authService;
  }

  static get users(): UsersService {
    return this._usersService;
  }

  static get competitions(): CompetitionsService {
    return this._competitionsService;
  }

  static get catalogs(): CatalogsService {
    return this._catalogsService;
  }

  static get groups(): GroupsService {
    return this._groupsService;
  }

  static get roles(): RolesService {
    return this._rolesService;
  }

  static get scopes(): ScopesService {
    return this._scopesService;
  }

  // For testing - allows replacing service implementations
  static setAuthService(service: AuthService): void {
    this._authService = service;
  }

  static setUsersService(service: UsersService): void {
    this._usersService = service;
  }

  static setCompetitionsService(service: CompetitionsService): void {
    this._competitionsService = service;
  }

  static setCatalogsService(service: CatalogsService): void {
    this._catalogsService = service;
  }

  static setGroupsService(service: GroupsService): void {
    this._groupsService = service;
  }

  static setRolesService(service: RolesService): void {
    this._rolesService = service;
  }

  static setScopesService(service: ScopesService): void {
    this._scopesService = service;
  }

  // Reset to default implementations (useful in test teardown)
  static resetToDefaults(): void {
    this._authService = authService;
    this._usersService = usersService;
    this._competitionsService = competitionsService;
    this._catalogsService = catalogsService;
    this._groupsService = groupsService;
    this._rolesService = rolesService;
    this._scopesService = scopesService;
  }
}
