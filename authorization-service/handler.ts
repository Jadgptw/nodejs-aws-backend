import "source-map-support/register";

import { getBasicAuthorizer } from "./src/handlers/basicAuthorizer";

const basicAuthorizer = getBasicAuthorizer();

export { basicAuthorizer };

