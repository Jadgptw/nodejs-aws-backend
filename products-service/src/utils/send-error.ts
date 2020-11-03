import { INTERNAL_SERVER_ERROR, getStatusText } from 'http-status-codes';

import { AppError } from "../models/app-error";

export const sendError = (error: AppError) => {
  const { message, statusCode = INTERNAL_SERVER_ERROR, status = getStatusText(INTERNAL_SERVER_ERROR) } = error;

  return {
    statusCode,
    body: JSON.stringify({ error: { message, status } })
  }
};
