import { generateNewPayment } from "../paymentPageService";

function handleFlow(ctPayment: any) {
  const dateTimeNow: Date = new Date();
  return {
    actions: [
      {
        action: "setCustomField",
        name: "pp_url",
        value: generateNewPayment(ctPayment),
      },
      {
        action: "addTransaction",
        transaction: {
          timestamp: dateTimeNow.toISOString(),
          type: "Charge",
          amount: {
            centAmount: ctPayment.amountPlanned.centAmount,
            currencyCode: ctPayment.amountPlanned.currencyCode,
          },
        },
      },
    ],
  };
}

export default handleFlow;
