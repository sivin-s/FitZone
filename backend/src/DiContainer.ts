// global container - implementation instead set logger as a parent - (because container is isolated to solve that one is global container setup(this setup) or another make logger parent or bind the every container to get the logger )

import { Container } from "inversify";

// import bindings/container or services
import { LoggerService } from "./shared/services/logger.services";
import type { ILogger } from "./shared/interfaces/ILogger.interfaces";

// import Module controllers/services/repositories
import { UserController } from "./modules/users/controllers/user.controllers";
import { UserService } from "./modules/users/services/user.services";
import type { IUserController } from "./modules/users/interfaces/IUserController.interfaces";
import type { IUserService } from "./modules/users/interfaces/IUserService.interfaces";
import type { IAuthController } from './modules/auth/interfaces/IAuthController.interfaces';
import { AuthController } from "./modules/auth/controllers/auth.controllers";
import type { IAuthService } from "./modules/auth/interfaces/IAuthService.interfaces";
import { AuthService } from "./modules/auth/services/auth.services";
import type { IAuthRepository } from "./modules/auth/interfaces/IAuthRepository.interfaces";
import { AuthRepository } from "./modules/auth/repositories/auth.repositories";
import type { IAdminController } from "./modules/admin/interfaces/IAdminController.interfaces";
import { AdminController } from "./modules/admin/controllers/admin.controllers";
import { AdminService } from "./modules/admin/services/admin.services";
import { AdminRepository } from "./modules/admin/repositories/admin.repositories";

// types 
import {
LOGGER_TYPES,
USER_TYPES,
AUTH_TYPES,
ADMIN_TYPES
}from './DITypes/index.DITypes'
import type { IAdminService } from "./modules/admin/interfaces/IAdminService.interfaces";
import type { IAdminRepository } from "./modules/admin/interfaces/IAdminRepository.interfaces";


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


