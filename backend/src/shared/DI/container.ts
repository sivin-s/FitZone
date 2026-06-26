// global container - implementation instead set logger as a parent - (because container is isolated to solve that one is global container setup(this setup) or another make logger parent or bind the every container to get the logger )

import { Container } from "inversify";

// import bindings/container or services
import { LoggerService } from "../services/logger.service";
import {TYPES as LOGGER_TYPES} from  "../../Logger/types/types.logger";
import type { ILogger } from "../interfaces/ILogger";


// import Module controllers/services/repositories
import { UserController } from "../../modules/users/controllers/user.controller";
import { UserService } from "../../modules/users/services/user.service";
import type { IUserController } from "../../modules/users/interfaces/IUserController";
import type { IUserService } from "../../modules/users/interfaces/IUserService";
import type { IAuthController } from '../../modules/auth/interfaces/IAuthController';
import { AuthController } from "../../modules/auth/controllers/auth.controller";
import type { IAuthService } from "../../modules/auth/interfaces/IAuthService";
import { AuthService } from "../../modules/auth/services/auth.service";
import type { IAuthRepository } from "../../modules/auth/interfaces/IAuthRepository";
import { AuthRepository } from "../../modules/auth/repositories/auth.repository";
import type { IAdminController } from "../../modules/admin/interfaces/IAdminController";
import { AdminController } from "../../modules/admin/controllers/admin.controller";
import { AdminService } from "../../modules/admin/services/admin.service";
import { AdminRepository } from "../../modules/admin/repositories/admin.repository";

// types 
import {TYPES as USER_TYPES} from "../../modules/users/types/types"
import {TYPES as ADMIN_TYPES} from "../../modules/admin/types/types"
import {TYPES as AUTH_TYPES} from  "../../modules/auth/types/types"
import type { IAdminService } from "../../modules/admin/interfaces/IAdminService";
import type { IAdminRepository } from "../../modules/admin/interfaces/IAdminRepository";


// create one shared container
const appContainer = new Container();

// bind global services -(available to everything;) - logger
appContainer.bind<ILogger>(LOGGER_TYPES.ILogger).to(LoggerService).inSingletonScope()  // create single instance shared to all (no memory leak)

// Auth module
appContainer.bind<IAuthController>(AUTH_TYPES.IAuthController).to(AuthController) 
appContainer.bind<IAuthService>(AUTH_TYPES.IAuthService).to(AuthService);
appContainer.bind<IAuthRepository>(AUTH_TYPES.IAuthRepository).to(AuthRepository);


// Admin Module
appContainer.bind<IAdminController>(ADMIN_TYPES.IAdminController).to(AdminController);
appContainer.bind<IAdminService>(ADMIN_TYPES.IAdminService).to(AdminService);
appContainer.bind<IAdminRepository>(ADMIN_TYPES.IAdminRepository).to(AdminRepository);

// user module 
appContainer.bind<IUserController>(USER_TYPES.IUserController).to(UserController);
appContainer.bind<IUserService>(USER_TYPES.IUserService).to(UserService);


export {appContainer}


