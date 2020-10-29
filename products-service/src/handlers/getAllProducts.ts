import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { getMockProducts } from "../mock-data/mock-products";
import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await getMockProducts();

    return sendResponse({ products })
  } catch (e) {
    return sendError(e);
  }
};
