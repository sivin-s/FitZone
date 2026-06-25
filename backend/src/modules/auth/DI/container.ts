import {Container} from "inversify";
import {TYPES} from "../types/types";
import type { IAdminRepository } from "../../admin/interfaces/IAdminRepository";
import type { IAdminService } from "../../admin/interfaces/IAdminService";
import type { IAdminController } from "../../admin/interfaces/IAdminController";
import { AdminRepository } from "../../admin/repositories/admin.repository";
import { AdminService } from "../../admin/services/admin.service";
import { AdminController } from "../../admin/controllers/admin.controller";

const authContainer = new Container();

authContainer.bind<IAdminRepository>(TYPES.IAuthRepository).to(AdminRepository);
authContainer.bind<IAdminService>(TYPES.IAuthService).to(AdminService);
authContainer.bind<IAdminController>(TYPES.IAuthController).to(AdminController);

export {authContainer}