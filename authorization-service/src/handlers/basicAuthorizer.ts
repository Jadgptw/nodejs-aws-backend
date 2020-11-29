import { APIGatewayAuthorizerCallback, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import 'source-map-support/register';

import { UNAUTHORIZED, getStatusText } from 'http-status-codes';

export const getBasicAuthorizer: () => (event: APIGatewayTokenAuthorizerEvent, context: any, callback: APIGatewayAuthorizerCallback) => void = () => (event, context, callback) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const { authorizationToken, methodArn, type } = event;
    if (type !== "TOKEN") {
      callback(getStatusText(UNAUTHORIZED));
    }

    const token = authorizationToken.split(" ")[1];
    const [username, password] = Buffer
      .from(token, "base64")
      .toString("utf-8")
      .split(":");
    const storedPassword = process.env[username?.toUpperCase()];
    const effect = !storedPassword || storedPassword !== password ? "Deny" : "Allow";

    console.log(`TOKEN: ${token}, USERNAME: ${username}, PASSWORD: ${password}, STORED_PASSWORD: ${storedPassword}, EFFECT: ${effect}`);

    callback(null, generatePolicy(token, methodArn, effect));
  } catch (e) {
    callback(`${getStatusText(UNAUTHORIZED)}: ${e.message}`);
  }
};

const generatePolicy: (principalId: string, Resource: string, Effect: string) => APIGatewayAuthorizerResult = (principalId: string, Resource: string, Effect: string = "Allow") => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource
        }
      ]
    }
  }
};
