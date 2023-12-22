import { callbackHandler } from "./src/controllers/gateController";
import { CommercetoolsError } from "./src/helpers/errors";
import functions from "@google-cloud/functions-framework";
import { logger } from "./src/utils/logger";

exports.handler = async (
  request: functions.Request,
  response: functions.Response,
) => {
  try {
    await callbackHandler(request?.body);
    response.status(200).send("Ok");
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      response
        .status(error.statusCode || 500)
        .send(JSON.stringify(error.toJson()));
    }
    response
      .status(500)
      .send(
        JSON.stringify({ message: error.message, stack: error.stack }, null, 3),
      );
  }
};
