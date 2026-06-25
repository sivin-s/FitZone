import {Container} from "inversify"
import {TYPES} from "../types/types"
// import {IUserRepository} from ""
import type { IUserController } from "../interfaces/IUserController"
import type { IUserService } from './../interfaces/IUserService';
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

const userContainer = new Container();

// bind interface to concrete classes
userContainer.bind<IUserController>(TYPES.IUserController).to(UserController);
userContainer.bind<IUserService>(TYPES.IUserService).to(UserService)

export {userContainer}

