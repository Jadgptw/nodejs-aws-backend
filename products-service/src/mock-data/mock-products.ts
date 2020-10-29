import { Product } from "../models/Product";
import products from "./products.json"

export const getMockProducts: () => Promise<Array<Product>> = () => {
  return Promise.resolve(products)
};

export const getMockProductById: (id: string) => Promise<Product> = (id: string) => {
  const product = products.find(product => product.id === id);

  return Promise.resolve(product);
};
