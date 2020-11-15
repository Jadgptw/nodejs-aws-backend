import * as AWS from "aws-sdk";
import { mock, setSDKInstance, restore } from "aws-sdk-mock";
import { APIGatewayProxyHandler } from "aws-lambda";

import { S3BucketService } from "../services/s3BucketService";
import { getImportProductsFile } from "../handlers/importProductsFile";

const getSignedUrl = (name: string) => `https://products-import-service-bucket.s3.eu-west-1.amazonaws.com/${name}?X-Amz-Algorithm=123&X-Amz-Credential=1234&X-Amz-Security-Token=12145&X-Amz-SignedHeaders=host`;

describe('importProductFile method', () => {
  let importProductsFile: APIGatewayProxyHandler;
  let event;

  beforeEach(() => {
    setSDKInstance(AWS);
    // @ts-ignore
    mock("S3", "getSignedUrl", (operation, params: { Key: string }, callback) => callback(null, getSignedUrl(params.Key)));

    const s3BucketService = new S3BucketService(AWS.S3);
    importProductsFile = getImportProductsFile(s3BucketService);
    event = { queryStringParameters: { name: "test.csv" } };
  });

  afterEach(() => restore("S3", "getSignedUrl"));

  test('should return 200 status code', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await importProductsFile(event);
    expect(result.statusCode).toBe(200);
  });

  test('should return correct signed URL', async () => {
    // @ts-ignore
    const result: { statusCode: number, body: any } = await importProductsFile(event);
    expect(JSON.parse(result.body).signedUrl).toBe(await getSignedUrl("uploaded/test.csv"));
  });
});
