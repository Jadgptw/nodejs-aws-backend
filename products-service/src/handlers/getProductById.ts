import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { sendResponse } from "../utils/send-response";
import { sendError } from "../utils/send-error";
import { productService } from "../services/product-service";

export const getProductsById: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { rows: [product] } = await productService.getProductsById(event.pathParameters["productId"]);

    return sendResponse({ product })
  } catch (e) {
    return sendError(e);
  }
};
