// @ts-ignore
import { signer } from "ecommpay";
import axios, { AxiosError } from "axios";
import { ecommpayConfig } from "../environmentService";
import { Payment } from "@commercetools/platform-sdk";

async function handleFlow(ctPayment: Payment) {
  const refundTransaction = ctPayment.transactions.find(
    (e) => e.state === "Initial",
  );
  if (!refundTransaction) {
    return { actions: [] };
  }

  const gateResponse = await sendRefundRequest(ctPayment, refundTransaction);

  const gateResponseBody = gateResponse.body;

  let actions: any[] = [];

  actions = changeTransactionState(
    actions,
    refundTransaction,
    gateResponse.statusCode,
  );
  if (gateResponse.statusCode === 200) {
    actions = changeTransactionInteractionId(
      actions,
      refundTransaction,
      gateResponseBody,
    );
  } else {
    actions = addInterfaceInteraction(
      actions,
      refundTransaction,
      gateResponse,
      gateResponseBody,
    );
  }

  return {
    version: ctPayment.version, // version mismatch can be received
    actions: actions,
  };
}

async function sendRefundRequest(
  ctPayment: any,
  refundTransaction: any,
): Promise<{
  statusCode: number;
  body:
    | {
        status: string;
        request_id: string;
        project_id: number;
        payment_id: string;
        code: string;
        message: string;
      }
    | NonNullable<unknown>;
  errorMessage: string;
}> {
  const clientId = ctPayment.lastModifiedBy.clientId;

  const refundParams = {
    general: {
      project_id: ecommpayConfig.projectId,
      payment_id: ctPayment.id,
      merchant_callback_url: ecommpayConfig.callbackUrl,
    },
    payment: {
      amount: refundTransaction.amount.centAmount,
      currency: refundTransaction.amount.currencyCode,
      description: `User ${clientId} create refund`,
    },
    interface_type: {
      id: ecommpayConfig.interfaceTypeId,
    },
  };

  // @ts-ignore
  refundParams.general.signature = signer(
    refundParams,
    ecommpayConfig.secretKey,
  );

  const url: string = ecommpayConfig.gateUrl + "/payment/refund";

  return await sendPost(url, refundParams);
}

async function sendPost(
  url: string,
  body: object = {},
  headers: object = {},
): Promise<{
  statusCode: number;
  body:
    | {
        status: string;
        request_id: string;
        project_id: number;
        payment_id: string;
        code: string;
        message: string;
      }
    | NonNullable<unknown>;
  errorMessage: string;
}> {
  Object.assign({ "Content-Type": "application/json" }, headers);
  return new Promise((resolve) => {
    axios
      .post(url, body)
      .then((response) => {
        resolve({
          statusCode: response.status,
          body: response.data,
          errorMessage: "",
        });
      })
      .catch((reason: AxiosError) => {
        resolve({
          statusCode: reason.response!.status,
          body: {},
          errorMessage: reason.message,
        });
      });
  });
}

//actions

function changeTransactionState(
  actions: any[],
  transaction: any,
  statusCode: number,
): any[] {
  actions.push({
    action: "changeTransactionState",
    transactionId: transaction.id,
    state: statusCode === 200 ? "Pending" : "Failure",
  });
  return actions;
}

function changeTransactionInteractionId(
  actions: any[],
  transaction: any,
  gateResponseBody: any,
): any[] {
  actions.push({
    action: "changeTransactionInteractionId",
    transactionId: transaction.id,
    interactionId: gateResponseBody.request_id.toString(),
  });
  return actions;
}

function addInterfaceInteraction(
  actions: any[],
  refundTransaction: any,
  gateResponse: any,
  gateResponseBody: any,
): any[] {
  const dateTimeNow: Date = new Date();
  actions.push({
    action: "addInterfaceInteraction",
    type: {
      key: "ecommpay-integration-interaction-payment-type",
    },
    fields: {
      operation_id: 0,
      operation_type: "refund",
      operation_status: "failed",
      date: dateTimeNow.toISOString(),
      sum_initial: refundTransaction.amount.centAmount.toString(),
      sum_converted: "",
      message: gateResponseBody
        ? gateResponseBody?.message
        : gateResponse.errorMessage,
    },
  });
  return actions;
}

export default handleFlow;
