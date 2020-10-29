import { getProductsById } from "../handlers/getProductById";
import productEvent from "./mock-data/existing-product-event.json";
import noProductEvent from "./mock-data/no-product-event.json";
import { Product } from "../models/product";
import { AppError } from "../models/app-error";

describe('getProductById method.', () => {
  test('should return 200 status code if Id exists', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(productEvent);
    expect(result.statusCode).toBe(200);
  });

  test('should return product if Id exists', async () => {
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
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(noProductEvent);
    expect(result.statusCode).toBe(404);
  });

  test('should return error message "Product not found"', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await getProductsById(noProductEvent);
    const body: { error: AppError } = JSON.parse(result.body);

    expect(body.error.message).toBe("Product not found");
  });
});
