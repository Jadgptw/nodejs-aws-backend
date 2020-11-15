import "source-map-support/register";
import { S3 } from "aws-sdk";

import { getImportProductsFile } from "./src/handlers/importProductsFile";
import { getImportFileParser } from "./src/handlers/importFileParser";
import { S3BucketService } from "./src/services/s3BucketService";


const s3BucketService = new S3BucketService(S3);
const importProductsFile = getImportProductsFile(s3BucketService);
const importFileParser = getImportFileParser(s3BucketService);

export { importProductsFile, importFileParser };
