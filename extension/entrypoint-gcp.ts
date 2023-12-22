import paymentController from "./src/controllers/paymentController";
import { CommercetoolsError, InternalServerError } from "./src/helpers/errors";
import functions from "@google-cloud/functions-framework";
import { logger } from "./src/utils/logger";

exports.handler = async (
  request: functions.Request,
  response: functions.Response,
) => {
  try {
    const response_body = await paymentController(request?.body);
    logger.log(response_body);
    response.send(JSON.stringify(response_body));
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      response.status(400).send(error.toJson());
    }
    const internalServerError = new InternalServerError(error.message);
    response.status(400).send(internalServerError.toJson());
  }
};
