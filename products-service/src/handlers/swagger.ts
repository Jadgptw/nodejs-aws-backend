import fs from "fs";
import path from "path";
import { promisify } from "util";
import { APIGatewayProxyHandler } from "aws-lambda";

import { sendError } from "../utils/send-error";

export const getApiDoc: APIGatewayProxyHandler = async () => {
  try {
    const swaggerSpec = process.env.LAMBDA_TASK_ROOT
      ? await (promisify(fs.readFile))(path.resolve(process.env.LAMBDA_TASK_ROOT, "./api/swagger.yaml"))
      : await (promisify(fs.readFile))(path.resolve(__dirname, "./api/swagger.yaml"));

    return {
      statusCode: 200,
      body: swaggerSpec.toString()
    }
  } catch (e) {
    return sendError(e);
  }
};
