import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
} from "@commercetools/sdk-client-v2";

import {
  commercetoolsConfig,
  ecommpayConfig,
} from "../services/environmentService";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const authMiddlewareOptions = {
  host: commercetoolsConfig.authUrl,
  projectKey: commercetoolsConfig.projectId,
  credentials: {
    clientId: commercetoolsConfig.clientId,
    clientSecret: commercetoolsConfig.clientSecret,
  },
  fetch,
};

const userAgentMiddlewareOptions = {
  libraryName: ecommpayConfig.packageName,
  libraryVersion: ecommpayConfig.version,
  contactUrl: ecommpayConfig.homePage,
  contactEmail: ecommpayConfig.authorEmail,
};

const httpMiddlewareOptions = {
  maskSensitiveHeaderData: true,
  host: commercetoolsConfig.apiUrl,
  enableRetry: true,
  fetch,
};

const queueMiddlewareOptions = {
  concurrency: 5,
};

const ctpClient = new ClientBuilder()
  .withAuthMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
  .withUserAgentMiddleware(userAgentMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withQueueMiddleware(queueMiddlewareOptions)
  .build();

export default createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: commercetoolsConfig.projectId,
});
