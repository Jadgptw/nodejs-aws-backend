import { AWSError, SNS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { PublishResponse } from "aws-sdk/clients/sns";

import { Product } from "../models/product";

class SnsService {
  private readonly SNS_ARN = process.env.SNS_ARN;
  private readonly sns: SNS;

  constructor(Sns) {
    this.sns = new Sns({ region: "eu-west-1" });
  }

  public async publishMessage(products: Array<Product>, invalidProducts: Array<Product>): Promise<PromiseResult<PublishResponse, AWSError>> {
    const succeededMessage = `${JSON.stringify(products)} records were successfully added to the database.`;
    const errorMessage = `Invalid products found: ${JSON.stringify(invalidProducts)}`;
    const Message = `
      ${products.length ? succeededMessage : ""} 
      ${invalidProducts.length ? errorMessage : ""}
    `;

    return await this.sns.publish(
      {
        Subject: "New Products are added to the database",
        Message,
        TopicArn: this.SNS_ARN,
        MessageAttributes: {
          Status: {
            DataType: "String",
            StringValue: invalidProducts.length ? "HasErrors" : "Succeeded"
          }
        }
      },
      () => console.log(`Email is sent with: "${Message}" message`)
    ).promise();
  }
}

export { SnsService };
