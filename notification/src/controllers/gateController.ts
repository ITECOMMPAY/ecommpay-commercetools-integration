// @ts-ignore
import { Callback } from "ecommpay";
import ctpBuilder from "../utils/ctp";
import { ecommpayConfig } from "../services/environmentService";
import { InvalidJsonInput } from "../helpers/errors";
import { availableActions } from "../helpers/actions";
import { logger } from "../utils/logger";

export const callbackHandler = async (body: string | object | null) => {
  const callback: Callback = getCallbackFromBody(body);
  logger.log(callback);

  const maxAttempt = 3;
  let currentAttempt = 0;
  let lastError: Error | null = null;

  while (currentAttempt < maxAttempt) {
    try {
      return await updatePayment(callback);
    } catch (error: any) {
      if (error.message !== "Version mismatch. Concurrent modification.") {
        throw error;
      }
      currentAttempt += 1;
      lastError = error;
    }
  }
  throw lastError;
};

function getCallbackFromBody(body: string | object | null): Callback {
  if (body === null) {
    throw new InvalidJsonInput("Received empty body");
  }

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (error: any) {
      throw new InvalidJsonInput(error.message);
    }
  }

  try {
    return new Callback(ecommpayConfig.secretKey, body);
  } catch (error) {
    throw new InvalidJsonInput("Invalid signature");
  }
}

async function updatePayment(callback: Callback) {
  const paymentId = callback.getPaymentId();
  const response = await ctpBuilder
    .payments()
    .withId({ ID: paymentId })
    .get({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .execute();

  const ctPayment = response.body;
  const version = ctPayment.version;

  let actions: any[] = [];

  actions = availableActions.setMethodInfoname(actions, callback, ctPayment);
  actions = availableActions.setStatusInterfaceCode(
    actions,
    callback,
    ctPayment,
  );
  //todo: - it's for v2
//  actions = availableActions.addRecurring(actions, callback);
  actions = availableActions.changeTransactionState(
    actions,
    callback,
    ctPayment,
  );

  actions = availableActions.addInterfaceInteraction(
    actions,
    callback,
    ctPayment,
  );
  actions = availableActions.changeTransactionInteractionId(
    actions,
    callback,
    ctPayment,
  );

  return await ctpBuilder
    .payments()
    .withId({ ID: paymentId })
    .post({
      body: {
        version,
        actions,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .execute();
}
