import products from "../mock-data/products.json";

import { Client } from "pg";
import * as AWS from "aws-sdk";
import { mock, setSDKInstance, restore } from "aws-sdk-mock";

import { SNS } from "aws-sdk";
import { getCatalogBatchProcess } from "../handlers/catalogBatchProcess";
import catalogBatchProcessEvent from "./mock-data/catalog-batch-process-event.json"
import { ProductService } from "../services/product-service";
import { SnsService } from "../services/SnsService";

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn().mockResolvedValueOnce({}),
    query: jest.fn().mockResolvedValue({ rows: products }),
    end: jest.fn().mockResolvedValueOnce({}),
  };
  return { Client: jest.fn(() => mClient) };
});

describe('catalogBatchProcess method.', () => {
  let productService: ProductService;
  let snsService: SnsService;
  let catalogBatchProcess;
  let client;

  beforeEach(() => {
    setSDKInstance(AWS);
    // @ts-ignore
    mock("SNS", "publish", (params: { Key: string }, callback) => callback(null, "success"));

    client = new Client();
    productService = new ProductService(client);
    snsService = new SnsService(SNS);
    catalogBatchProcess = getCatalogBatchProcess(productService, snsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    restore("SNS", "publish")
  });

  test('should call connect message', async () => {
    await catalogBatchProcess(catalogBatchProcessEvent);
    expect(client.connect).toBeCalledTimes(1);
  });

  test('should call query message', async () => {
    await catalogBatchProcess(catalogBatchProcessEvent);
    expect(client.query).toBeCalledTimes(3);
  });

  test('should call end message', async () => {
    await catalogBatchProcess(catalogBatchProcessEvent);
    expect(client.end).toBeCalledTimes(1);
  });

});
