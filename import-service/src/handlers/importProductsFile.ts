import { APIGatewayProxyHandler } from "aws-lambda";
import 'source-map-support/register';
import { S3 } from "aws-sdk";

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { BUCKET } from "../config";

export const importProductsFile: APIGatewayProxyHandler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { name } = event.queryStringParameters;
    const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return sendResponse({ signedUrl })
  } catch (e) {
    return sendError(e);
  }
};
