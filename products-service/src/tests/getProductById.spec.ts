import { Client } from 'pg';

import { getGetProductsById } from "../handlers/getProductById";
import productEvent from "./mock-data/existing-product-event.json";
import noProductEvent from "./mock-data/no-product-event.json";
import { Product } from "../models/product";
import { AppError } from "../models/app-error";
import { ProductService } from "../services/product-service";
import products from "../mock-data/products.json"

jest.mock('pg', () => {
  const mClient = data => ({
    connect: jest.fn().mockResolvedValueOnce({}),
    query: jest.fn().mockResolvedValueOnce(data),
    end: jest.fn().mockResolvedValueOnce({}),
  });
  return { Client: jest.fn(data => mClient(data)) };
});

describe('getProductById method.', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 status code if Id exists', async () => {
    // @ts-ignore
    const productService = new ProductService(new Client({ rows: [products[3]] }));
    const getProductsById = getGetProductsById(productService);
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(productEvent);
    expect(result.statusCode).toBe(200);
  });

  test('should return product if Id exists', async () => {
    // @ts-ignore
    const productService = new ProductService(new Client({ rows: [products[3]] }));
    const getProductsById = getGetProductsById(productService);
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(productEvent);
    const body: { product: Product } = JSON.parse(result.body);

    expect(body.product).toStrictEqual({
      count: 12,
      description: "Short Product Description7",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      price: 15,
      title: "ProductTitle"
    });
  });

  test('should return 404 status code if Id doesn\'t exist', async () => {
    const productService = new ProductService(new Client());
    const getProductsById = getGetProductsById(productService);
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(noProductEvent);
    expect(result.statusCode).toBe(404);
  });

  test('should return error message "Product not found"', async () => {
    const productService = new ProductService(new Client());
    const getProductsById = getGetProductsById(productService);
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(noProductEvent);
    const body: { error: AppError } = JSON.parse(result.body);

    expect(body.error.message).toBe("Product not found");
  });
});
