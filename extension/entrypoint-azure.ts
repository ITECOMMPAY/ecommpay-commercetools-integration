import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CommercetoolsError, InternalServerError } from "./src/helpers/errors";
import paymentController from "./src/controllers/paymentController";
import { logger } from "./src/utils/logger";

export async function extension(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  logger.setAzureContext(context);
  try {
    const body = await request.text();
    const response = await paymentController(body);
    logger.log(response);
    return {
      status: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      return {
        status: 400,
        body: JSON.stringify(error.toJson()),
      };
    }
    const internalServerError = new InternalServerError(error.message);
    return {
      status: 400,
      body: JSON.stringify(internalServerError.toJson()),
    };
  }
}

app.http("extension", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: extension,
});
