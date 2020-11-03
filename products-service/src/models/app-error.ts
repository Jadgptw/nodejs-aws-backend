export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public message: string;

  constructor(message, statusCode, status) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.status = status;
  }
}
