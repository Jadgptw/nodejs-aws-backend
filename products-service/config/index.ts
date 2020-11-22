import dotenv from 'dotenv';
import { ClientConfig } from "pg";

const SQS_NAME = "catalogItemsQueue";
const TOPIC_NAME = "catalogItemsTopic";

dotenv.config({ path: './config/config.env' });

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

export { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, SQS_NAME, TOPIC_NAME, dbOptions };
