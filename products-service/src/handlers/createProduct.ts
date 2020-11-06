import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { CREATED } from "http-status-codes";

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { Product } from "../models/product";
import { productSchema } from "../validators/product-validator";
import { productService } from "../services/product-service";

export const createProduct: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);
  const data: Product = JSON.parse(event.body);

  try {
    const { error } = productSchema.validate(data);
    if (error) {
      return sendError(error);
    }

    const product = await productService.createProduct(data);

    return sendResponse({ product }, CREATED);
  } catch (e) {
    return sendError(e);
  }
};
