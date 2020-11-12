import { S3Event } from "aws-lambda";
import 'source-map-support/register';
import { S3 } from "aws-sdk";

import csv from "csv-parser";

import { CREATED } from "http-status-codes";

import { sendError } from "../utils/send-error";
import { sendResponse } from "../utils/send-response";
import { BUCKET } from "../config";

export const importFileParser = async (event: S3Event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    const s3 = new S3({ region: "eu-west-1" });

    await Promise.all(event.Records.map(async record => {
      return await new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: BUCKET,
            Key: record.s3.object.key
          })
          .createReadStream()
          .pipe(csv())
          .on("data", console.log)
          .on("end", async () => {
            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace("uploaded", "parsed")
            }).promise();

            await s3.deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key
            }).promise();
            resolve();
          })
          .on("error", error => {
            console.log(error);
            reject();
          })
      });
    }));

    return sendResponse({ data: [] }, CREATED)
  } catch (e) {
    return sendError(e);
  }
};
