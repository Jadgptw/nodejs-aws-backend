import 'source-map-support/register';

import { SQSEvent, SQSRecord } from "aws-lambda";

import { SnsService } from "../services/SnsService";
import { Product } from "../models/product";
import { productSchema } from "../validators/product-validator";
import { ProductService } from "../services/product-service";

export const getCatalogBatchProcess = (productsService: ProductService, snsService: SnsService) => async (event: SQSEvent, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { productsToSave, invalidProducts } = filterNonValidProducts(event.Records);
    const products =  productsToSave.length ? await productsService.bulkProductsCreate(productsToSave) : [];

    await snsService.publishMessage(products, invalidProducts);
    console.log(`${JSON.stringify(products)} records were successfully added to the database.${invalidProducts.length ? ` Invalid products found: ${JSON.stringify(invalidProducts)}` : ""}`);
  } catch (e) {
    console.error(`Error appeared while adding data to the database: ${e}`)
  }
};

const filterNonValidProducts = (records: Array<SQSRecord>): { productsToSave: Array<Product>, invalidProducts: Array<Product> } => {
  const productsToSave: Array<Product> = [];
  const invalidProducts: Array<Product> = [];

  records.map(({ body }) => {
    const product = JSON.parse(body);
    const { error } = productSchema.validate(product);
    !!error ? invalidProducts.push(product) : productsToSave.push(product)
  });

  return { productsToSave, invalidProducts };
};
