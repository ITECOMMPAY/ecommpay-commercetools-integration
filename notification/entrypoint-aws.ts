import { APIGatewayProxyHandler } from "aws-lambda";
import { CommercetoolsError } from "./src/helpers/errors";
import { callbackHandler } from "./src/controllers/gateController";
import { logger } from "./src/utils/logger";

// @ts-ignore
export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    await callbackHandler(event.body);
    return {
      statusCode: 200,
      body: "Ok",
    };
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify(error.toJson()),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(
        { message: error.message, stack: error.stack },
        null,
        3,
      ),
    };
  }
};
