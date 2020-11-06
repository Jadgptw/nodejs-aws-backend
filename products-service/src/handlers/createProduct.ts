import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { CREATED } from "http-status-codes";
import { Client } from "pg";

import { dbOptions } from "../../config";
import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { Product } from "../models/product";
import { productSchema } from "../validators/product-validator";

const createProductQueryString = "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *";
const createStockQueryString = "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING count";

export const createProduct: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${event}, Context: ${context}`);
  const client = new Client(dbOptions);
  const { price, description, title, count } = JSON.parse(event.body) as Product;

  try {
    const { error } = productSchema.validate({ price, description, title });
    if (error) {
      return sendError(error);
    }

    await client.connect();

    await client.query("BEGIN");
    const { rows: [product] } = await client.query(createProductQueryString, [title, description, price]);
    const { rows: [stock] } = await client.query(createStockQueryString, [(product as Product).id, count || 0]);
    await client.query('COMMIT');

    return sendResponse({ product: { ...product, ...stock } }, CREATED);
  } catch (e) {
    await client.query('ROLLBACK');

    return sendError(e);
  } finally {
    client.end()
  }
};
