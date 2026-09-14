export interface ILogger {
  info(message: unknown, isAdmin?: boolean): void;
  error(message: unknown, isAdmin?: boolean): void;
  warn(message: unknown, isAdmin?: boolean): void;
  debug(message: unknown, isAdmin?: boolean): void;
}
