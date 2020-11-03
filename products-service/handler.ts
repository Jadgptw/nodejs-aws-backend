import "source-map-support/register";

import { getProductsList } from "./src/handlers/getAllProducts";
import { getProductsById } from "./src/handlers/getProductById";
import { getApiDoc } from "./src/handlers/swagger";

export { getProductsList, getProductsById, getApiDoc };
