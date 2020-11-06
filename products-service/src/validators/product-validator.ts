import { BAD_REQUEST, getStatusText } from 'http-status-codes';

import Joi from '@hapi/joi';
import { AppError } from '../models/app-error';

export const productSchema = Joi.object({
  id: Joi.string().uuid().error(new AppError('Please provide a valid user uuid Id', BAD_REQUEST, getStatusText(BAD_REQUEST))),
  title: Joi.string().required().error(new AppError('Please provide a valid product title', BAD_REQUEST, getStatusText(BAD_REQUEST))),
  description: Joi.string().required().error(new AppError('Please provide a valid product description', BAD_REQUEST, getStatusText(BAD_REQUEST))),
  price: Joi.number().required().min(0).error(new AppError('Please provide a valid product price, which should be more than 0', BAD_REQUEST, getStatusText(BAD_REQUEST))),
  count: Joi.number().min(0).error(new AppError('Please provide a valid count value, which should be more than 0', BAD_REQUEST, getStatusText(BAD_REQUEST)))
});
