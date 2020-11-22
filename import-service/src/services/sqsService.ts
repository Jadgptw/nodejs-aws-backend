import { AWSError, SQS } from "aws-sdk";
import { SendMessageResult } from "aws-sdk/clients/sqs";

import { Product } from "../models/product";
import {PromiseResult} from "aws-sdk/lib/request";

class SqsService {
  private readonly SQS_URL = process.env.SQS_URL;
  private readonly sqs: SQS;

  constructor(Sqs) {
    this.sqs = new Sqs({ region: "eu-west-1" });
  }

  public async sendMessage(product: Product): Promise<PromiseResult<SendMessageResult, AWSError>> {
    const MessageBody = JSON.stringify(product);

    return await this.sqs.sendMessage(
      {
        QueueUrl: this.SQS_URL,
        MessageBody
      },
      () => console.log(`Message body: ${MessageBody}`)
    ).promise();
  }
}

export { SqsService };
