import { getProductsList } from "../handlers/getAllProducts";
import products from "../mock-data/products.json";
import { Product } from "../models/product";

describe('getProductsList method.', () => {
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
