import dotenv from 'dotenv';
import { ClientConfig } from "pg";

const TOPIC_NAME = "catalogItemsTopic";
const CATALOG_ITEMS_QUEUE_ARN = "arn:aws:sqs:eu-west-1:070294412691:catalogItemsQueue";

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

export { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, TOPIC_NAME, CATALOG_ITEMS_QUEUE_ARN, dbOptions };
