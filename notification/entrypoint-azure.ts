import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CommercetoolsError } from "../notification/src/helpers/errors";
import { callbackHandler } from "../notification/src/controllers/gateController";
import { logger } from "./src/utils/logger";

export async function notification(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  logger.setAzureContext(context);
  try {
    const body = await request.text();
    await callbackHandler(body);
    return {
      status: 200,
      body: "Ok",
    };
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      return {
        status: error.statusCode || 500,
        body: JSON.stringify(error.toJson()),
      };
    }
    return {
      status: 500,
      body: JSON.stringify(error, null, 3),
    };
  }
}

app.http("notification", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: notification,
});
