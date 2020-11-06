import { Client, QueryResult } from "pg";

import { NOT_FOUND, getStatusText } from "http-status-codes";

import { dbOptions } from "../../config";
import { Product } from "../models/product";
import { AppError } from "../models/app-error";

class ProductService {
  private readonly getProductsListQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id";
  private readonly getProductQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE p.id = $1";
  private readonly createProductQueryString = "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *";
  private readonly createStockQueryString = "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING count";

  public async getProductList(): Promise<QueryResult<Array<Product>>> {
    const client = new Client(dbOptions);
    try {
      await client.connect();

      return await client.query(this.getProductsListQueryString);
    } finally {
      client.end();
    }
  }

  public async getProductsById(id: string): Promise<QueryResult<Product>> {
    const client = new Client(dbOptions);
    try {
      await client.connect();

      const product = await client.query(this.getProductQueryString, [id]);
      if (!product) {
        throw new AppError("Product not found", NOT_FOUND, getStatusText(NOT_FOUND))
      }

      return product;
    } finally {
      client.end();
    }
  }

  public async createProduct({ title, description, price, count }: Product): Promise<QueryResult<Product>> {
    const client = new Client(dbOptions);
    try {
      await client.connect();

      await client.query("BEGIN");
      const { rows: [product] } = await client.query(this.createProductQueryString, [title, description, price]);
      const { rows: [stock] } = await client.query(this.createStockQueryString, [(product as Product).id, count || 0]);
      await client.query('COMMIT');

      return { ...product, ...stock };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.end();
    }
  }
}

const productService = new ProductService();

export { productService };
