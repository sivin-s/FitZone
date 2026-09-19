import type { RequestHandler } from "express";
/*
 Notice: RequestHandler -> built-in type provided by Express for route handlers.
 To - implement type conflict in controller. 
*/
export interface IAdminController {
  getUsers: RequestHandler;
  blockUser: RequestHandler;
  unblockUser: RequestHandler;
  updateUser: RequestHandler;
  // getUsers(req: Request, res: Response, next: NextFunction):Promise<void>;
  // blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  // unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  // updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
