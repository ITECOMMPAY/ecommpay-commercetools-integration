// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Payment, signer } from "ecommpay";
import { ecommpayConfig } from "./environmentService";
import { InvalidJsonInput } from "../helpers/errors";

export function generateNewPayment(ctPayment: any): string {
  const e = new Payment(ecommpayConfig.projectId, ecommpayConfig.secretKey);

  //todo: - it's for v2
//  const initialRecurringString = ctPayment.custom?.fields?.recurring_object;
  const initialRequestString = ctPayment.custom?.fields?.initial_request;

  if (initialRequestString) {
    appendInitialParams(e, initialRequestString);
  }
  //todo: - it's for v2
//  if (initialRecurringString) {
//    appendRecurring(e, initialRecurringString);
//  }

  e.payment_id = ctPayment.id;
  e.payment_currency = ctPayment.amountPlanned.currencyCode;
  e.payment_amount = ctPayment.amountPlanned.centAmount;
  e.merchant_callback_url = ecommpayConfig.callbackUrl;
  e.card_operation_type = "sale";
  e.interface_type = ecommpayConfig.interfaceTypeId;

  const signature = signer(e.params, ecommpayConfig.secretKey);
  //unsigned parameters
  e._plugin_version = ecommpayConfig.version;
  const params = e.getQueryString();
  return `${e.baseURI}/payment?${params}&signature=${encodeURIComponent(
    signature,
  )}`;
}

function getObjectFromString(s: string) {
  try {
    return JSON.parse(s);
  } catch (error: any) {
    throw new InvalidJsonInput(
      "Invalid json object received: " + s + " \n" + error.message,
    );
  }
}

function appendInitialParams(
  paymentObject: Payment,
  initialParamsString: string,
) {
  const jsonPaymentDataRequest = getObjectFromString(initialParamsString);
  for (const key in jsonPaymentDataRequest) {
    paymentObject[key] = jsonPaymentDataRequest[key];
  }
}

//todo: - it's for v2
//function appendRecurring(paymentObject: Payment, recurringString: string) {
//  getObjectFromString(recurringString);
//  paymentObject.recurring_register = 1;
//  paymentObject.recurring = recurringString;
//}
