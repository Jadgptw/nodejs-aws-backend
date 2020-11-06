import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { Client } from "pg";
import { dbOptions } from "../../config";

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";

const getProductsListQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id";

export const getProductsList: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${event}, Context: ${context}`);
  const client = new Client(dbOptions);

  try {
    await client.connect();

    const { rows: products } = await client.query(getProductsListQueryString);

    return sendResponse({ products })
  } catch (e) {
    return sendError(e);
  } finally {
    client.end()
  }
};
