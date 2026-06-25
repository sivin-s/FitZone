import { Container } from "inversify";
import { TYPES } from "../types/types";
import type { IAdminRepository } from "../interfaces/IAdminRepository";
import type { IAdminService } from "../interfaces/IAdminService";
import type { IAdminController } from "../interfaces/IAdminController";
import { AdminRepository } from "../repositories/admin.repository";
import { AdminService } from "../services/admin.service";
import { AdminController } from "../controllers/admin.controller";

const adminContainer = new Container();

// bind interface to concrete classes
adminContainer
  .bind<IAdminRepository>(TYPES.IAdminRepository)
  .to(AdminRepository);
adminContainer.bind<IAdminService>(TYPES.IAdminService).to(AdminService);
adminContainer
  .bind<IAdminController>(TYPES.IAdminController)
  .to(AdminController);

export { adminContainer };
