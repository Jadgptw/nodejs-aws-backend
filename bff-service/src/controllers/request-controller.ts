import axios, { Method } from "axios";
import { BAD_GATEWAY, getStatusText } from 'http-status-codes';

import { AppError } from "../utils/error-handler";
import { catchAsync } from "../utils/catch-async";
import { getServiceUrl } from "../utils/getServiceUrl";
import { getAxiosConfig } from "../utils/getAxiosConfig";

export const requestController = catchAsync(async ({ originalUrl, method, body }, res, next) => {
  const serviceUrl = getServiceUrl(originalUrl);

  if (!serviceUrl) {
    return next(new AppError('Cannot process request', BAD_GATEWAY, getStatusText(BAD_GATEWAY)));
  }

  const { status, data } = await axios(getAxiosConfig(serviceUrl, originalUrl, method as Method, body));

  res.status(status).json(data);
});
