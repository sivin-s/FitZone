export interface ILogger{
    info(message: any, isAdmin?: boolean): void;
    error(message: any, isAdmin?: boolean): void;
    warn(message: any, isAdmin?: boolean): void;
    debug(message: any, isAdmin?: boolean): void;
}