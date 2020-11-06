import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { productService } from "../services/product-service";

export const getProductsList: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { rows: products } = await productService.getProductList();

    return sendResponse({ products })
  } catch (e) {
    return sendError(e);
  }
};
