import { S3Event } from "aws-lambda";
import 'source-map-support/register';

import csv from "csv-parser";

import { s3BucketService } from "../services/s3BucketService";

export const importFileParser = async (event: S3Event, context) => {
  console.log(`Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`);

  try {
    await Promise.all(event.Records.map(async record => {
      return await new Promise((resolve, reject) => {
        s3BucketService.getObjectReadStream(record.s3.object.key)
          .pipe(csv())
          .on("data", console.log)
          .on("end", async () => {
            await s3BucketService.copyObject(record.s3.object.key, "uploaded", "parsed");
            await s3BucketService.deleteObject(record.s3.object.key);

            resolve();
          })
          .on("error", error => {
            console.log(error);
            reject();
          })
      });
    }));

    console.log(`${event.Records.map(record => `${record.s3.object.key}`).join(", ")} were successfully moved from uploaded to parsed folder`)
  } catch (e) {
    console.error(`Error appeared while moving files from uploaded to parsed folder: ${e}`)
  }
};
