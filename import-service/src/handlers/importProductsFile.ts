import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { S3BucketService } from "../services/s3BucketService";

export const getImportProductsFile: (s3BucketService: S3BucketService) => APIGatewayProxyHandler = s3BucketService => async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { name } = event.queryStringParameters;

    const signedUrl = await s3BucketService.getSignedUrl(name);

    return sendResponse({ signedUrl })
  } catch (e) {
    return sendError(e);
  }
};
