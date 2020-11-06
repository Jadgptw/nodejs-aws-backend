import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { NOT_FOUND, getStatusText } from "http-status-codes";
import { Client } from "pg";
import { dbOptions } from "../../config";

import { sendResponse } from "../utils/send-response";
import { sendError } from "../utils/send-error";
import { AppError } from "../models/app-error";

const getProductQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE p.id = $1";

export const getProductsById: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${event}, Context: ${context}`);
  const client = new Client(dbOptions);

  try {
    await client.connect();

    const { rows: [product] } = await client.query(getProductQueryString, [event.pathParameters["productId"]]);
    if (!product) {
      throw new AppError("Product not found", NOT_FOUND, getStatusText(NOT_FOUND))
    }

    return sendResponse({ product })
  } catch (e) {
    return sendError(e);
  } finally {
    client.end()
  }
};
