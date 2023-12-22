import { APIGatewayProxyHandler } from "aws-lambda";
import paymentController from "./src/controllers/paymentController";
import { CommercetoolsError, InternalServerError } from "./src/helpers/errors";
import { logger } from "./src/utils/logger";

// @ts-ignore
export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const response = await paymentController(event.body);
    logger.log(response);
    return {
      statusCode: 200,
      body: response,
    };
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.toJson()),
      };
    }
    const internalServerError = new InternalServerError(error.message);
    return {
      statusCode: 400,
      body: internalServerError.toJson(),
    };
  }
};
