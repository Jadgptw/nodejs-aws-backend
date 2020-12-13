import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';

export const errorHandler = (err, _req, res, _next) => {
  const { error = err } = err;
  const { status = getStatusText(INTERNAL_SERVER_ERROR), statusCode = INTERNAL_SERVER_ERROR } = error;

  res.status(statusCode).json({ status, error });
};

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
