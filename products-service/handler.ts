import "source-map-support/register";

import { SNS } from "aws-sdk";
import { Client } from "pg";

import { dbOptions } from "./config";

import { getGetProductsList } from "./src/handlers/getAllProducts";
import { getGetProductsById } from "./src/handlers/getProductById";
import { getCreateProduct } from "./src/handlers/createProduct";
import { getCatalogBatchProcess } from "./src/handlers/catalogBatchProcess";
import { getApiDoc } from "./src/handlers/swagger";

import { SnsService } from "./src/services/SnsService";
import { ProductService } from "./src/services/product-service";

const productService = new ProductService(Client, dbOptions);
const snsService = new SnsService(SNS);

const getProductsList = getGetProductsList(productService);
const getProductsById = getGetProductsById(productService);
const createProduct = getCreateProduct(productService);
const catalogBatchProcess = getCatalogBatchProcess(productService, snsService);

export { getProductsList, getProductsById, createProduct, catalogBatchProcess, getApiDoc };
