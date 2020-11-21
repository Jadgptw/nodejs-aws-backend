import "source-map-support/register";
import { S3, SQS } from "aws-sdk";

import { getImportProductsFile } from "./src/handlers/importProductsFile";
import { getImportFileParser } from "./src/handlers/importFileParser";
import { S3BucketService } from "./src/services/s3BucketService";
import { SqsService } from "./src/services/sqsService";


const s3BucketService = new S3BucketService(S3);
const sqsService = new SqsService(SQS);

const importProductsFile = getImportProductsFile(s3BucketService);
const importFileParser = getImportFileParser(s3BucketService, sqsService);

export { importProductsFile, importFileParser };
