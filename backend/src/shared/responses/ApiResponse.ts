export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;
  public readonly statusCode: number;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
