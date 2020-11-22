import products from "../mock-data/products.json";

import { Client } from "pg";

import { getGetProductsList } from "../handlers/getAllProducts";
import { Product } from "../models/product";
import { ProductService } from "../services/product-service";

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn().mockResolvedValueOnce({}),
    query: jest.fn().mockResolvedValue({ rows: products }),
    end: jest.fn().mockResolvedValueOnce({}),
  };
  return { Client: jest.fn(() => mClient) };
});

describe('getProductsList method.', () => {
  let productService;
  let getProductsList;

  beforeEach(() => {
    productService = new ProductService(new Client());
    getProductsList = getGetProductsList(productService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 status code', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsList();
    expect(result.statusCode).toBe(200);
  });

  test('should return products', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsList();
    const body: { products: Array<Product> } = JSON.parse(result.body);

    expect(body.products).toStrictEqual(products);
  });
});
