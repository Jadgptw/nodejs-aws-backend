import {Client, ClientConfig, QueryResult} from "pg";

import { NOT_FOUND, getStatusText } from "http-status-codes";

import { Product } from "../models/product";
import { AppError } from "../models/app-error";

class ProductService {
  private readonly getProductsListQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id";
  private readonly getProductQueryString = "SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE p.id = $1";
  private readonly createProductQueryString = "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *";
  private readonly createStockQueryString = "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING count";
  // @ts-ignore
  private readonly getBulkCreateProductsString = (products: Array<Product>) => products.reduce((result, product, i) => {
    return `${result} ($${1 + 3 * i}, $${2 + 3 * i}, $${3 + 3 * i})${i + 1 !== products.length ? "," : " RETURNING id"}`
  }, "INSERT INTO products (title, description, price) VALUES");
  // @ts-ignore
  private readonly getBulkCreateStocksString = (ids: Array<number>) => ids.reduce((result, id, i) => {
    return `${result} ($${1 + 2 * i}, $${2 + 2 * i})${i + 1 !== ids.length ? "," : " RETURNING count"}`
  }, "INSERT INTO stocks (product_id, count) VALUES");

  private readonly Client;
  private readonly dbOptions: ClientConfig;

  public client: Client;

  constructor(Client, dbOptions?: ClientConfig) {
    this.Client = Client;
    this.dbOptions = dbOptions;
  }

  public async getProductList(): Promise<QueryResult<Array<Product>>> {
    this.client = new this.Client(this.dbOptions);

    try {
      await this.client.connect();

      return await this.client.query(this.getProductsListQueryString);
    } finally {
      this.client.end();
    }
  }

  public async getProductsById(id: string): Promise<QueryResult<Product>> {
    this.client = new this.Client(this.dbOptions);

    try {
      await this.client.connect();
      const product = await this.client.query(this.getProductQueryString, [id]);
      if (!product) {
        throw new AppError("Product not found", NOT_FOUND, getStatusText(NOT_FOUND))
      }

      return product;
    } finally {
      this.client.end();
    }
  }

  public async createProduct({ title, description, price, count }: Product): Promise<QueryResult<Product>> {
    this.client = new this.Client(this.dbOptions);

    try {
      await this.client.connect();

      await this.client.query("BEGIN");
      const { rows: [product] } = await this.client.query(this.createProductQueryString, [title, description, price]);
      const { rows: [stock] } = await this.client.query(this.createStockQueryString, [(product as Product).id, count || 0]);
      await this.client.query('COMMIT');

      return { ...product, ...stock };
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e;
    } finally {
      this.client.end();
    }
  }

  public async bulkProductsCreate(productsToSave: Array<Product>): Promise<Array<Product>> {
    this.client = new this.Client(this.dbOptions);

    try {
      await this.client.connect();

      await this.client.query("BEGIN");
      const { rows: productsIds } = await this.client.query(this.getBulkCreateProductsString(productsToSave), this.getBulkInsertProductValues(productsToSave));
      await this.client.query(this.getBulkCreateStocksString(productsIds), this.getBulkInsertStockValues(productsIds, productsToSave.map(product => product.count || 0)));
      await this.client.query('COMMIT');

      return productsToSave.map((product, i) => ({ ...product, id: productsIds[i] }))
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e;
    } finally {
      this.client.end();
    }
  }

  private getBulkInsertProductValues(products: Array<Product>): Array<any> {
    return products.reduce((result, product) => [
      ...result,
      product.title,
      product.description,
      product.price
    ], []);
  }

  private getBulkInsertStockValues(products: Array<Product>, countValues: Array<number>): Array<any> {
    return products.reduce((result, product, i) => [
      ...result,
      product.id,
      countValues[i]
    ], []);
  }
}

export { ProductService };
