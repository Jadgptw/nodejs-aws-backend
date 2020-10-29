import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { NOT_FOUND, getStatusText } from "http-status-codes";

import { getMockProductById } from "../mock-data/mock-products";
import { sendResponse } from "../utils/send-response";
import { sendError } from "../utils/send-error";
import { AppError } from "../models/app-error";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const product = await getMockProductById(event.pathParameters["productId"]);
    if (!product) {
      throw new AppError("Product not found", NOT_FOUND, getStatusText(NOT_FOUND))
    }

    return sendResponse({ product })
  } catch (e) {
    return sendError(e);
  }
};
