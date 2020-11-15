import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { CopyObjectOutput, DeleteObjectOutput } from "aws-sdk/clients/s3";
import stream from "stream";

import { BUCKET } from "../config";

class S3BucketService {
  private readonly BUCKET = BUCKET;
  private readonly s3: S3;

  constructor(Bucket) {
    this.s3 = new Bucket({ region: "eu-west-1", signatureVersion: "v4" });
  }

  public async getSignedUrl(name: string): Promise<string> {
    const params = {
      Bucket: this.BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60
    };

    return await this.s3.getSignedUrlPromise("putObject", params)
  }

  public getObjectReadStream(key: string): stream.Readable {
    return this.s3.getObject({
      Bucket: this.BUCKET,
      Key: key
    }).createReadStream()
  }

  public async copyObject(key: string, from: string, to: string): Promise<PromiseResult<CopyObjectOutput, AWSError>> {
    return await this.s3.copyObject({
      Bucket: this.BUCKET,
      CopySource: `${this.BUCKET}/${key}`,
      Key: key.replace(from, to)
    }).promise();
  }

  public async deleteObject(key: string): Promise<PromiseResult<DeleteObjectOutput, AWSError>> {
    return this.s3.deleteObject({
      Bucket: this.BUCKET,
      Key: key
    }).promise();
  }
}

export { S3BucketService };
