import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

import { AppError } from "../models/app-error";

export const sendError = (error: AppError) => {
  const { statusCode = INTERNAL_SERVER_ERROR } = error;

  return {
    statusCode,
    body: JSON.stringify({ error })
  }
};
