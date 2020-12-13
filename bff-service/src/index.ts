import express from 'express';
import cors from "cors";

import "../config";

import { errorHandler } from "./utils/error-handler";
import { requestController } from "./controllers/request-controller";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use(cors());

app.all('/*', requestController);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
