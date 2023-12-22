// @ts-ignore
import { Callback } from "ecommpay";

export const availableActions = {
  //  addRecurring, //todo: - it's for v2
  setMethodInfoname,
  setStatusInterfaceCode,
  addInterfaceInteraction,
  changeTransactionState,
  changeTransactionInteractionId,
};

//todo: - it's for v2
//function addRecurring(actions: any[], callback: Callback): any[] {
//  if (callback.callback?.recurring?.id) {
//    actions.push({
//      action: "setCustomField",
//      name: "recurring_id",
//      value: JSON.stringify(callback.callback.recurring),
//    });
//    actions.push({
//      action: "setCustomField",
//      name: "recurring_object",
//      value: callback.callback.recurring.id.toString(),
//    });
//  }
//  return actions;
//}

function setMethodInfoname(
  actions: any[],
  callback: Callback,
  ctPayment: any,
): any[] {
  if (!ctPayment?.paymentMethodInfo?.name) {
    actions.push({
      action: "setMethodInfoName",
      name: {
        en: callback.callback.payment.method,
      },
    });
  }
  return actions;
}

function setStatusInterfaceCode(
  actions: any[],
  callback: Callback,
  ctPayment: any,
): any[] {
  if (
    callback.callback.payment.status !== ctPayment?.paymentStatus?.interfaceCode
  ) {
    actions.push({
      action: "setStatusInterfaceCode",
      interfaceCode: callback.callback.payment.status,
    });
  }
  return actions;
}

function addInterfaceInteraction(
  actions: any[],
  callback: Callback,
  ctPayment: any,
): any[] {
  const operation = callback.callback.operation;
  const dateTimeNow: Date = new Date();
  const action = {
    action: "addInterfaceInteraction",
    type: {
      key: "ecommpay-integration-interaction-payment-type",
    },
    fields: {
      operation_id: Number(operation.id) || 0,
      operation_type: operation.type,
      operation_status: operation.status,
      date: operation.date || dateTimeNow.toISOString(),
      sum_initial: JSON.stringify(operation.sum_initial),
      sum_converted: JSON.stringify(operation.sum_converted) || "",
      message: operation.message,
    },
  };
  //do not add the same transaction. But operation.date(s) can be different at the 1 second
  if (listContainsObject(action.fields, ctPayment.interfaceInteractions)) {
    return actions;
  }
  actions.push(action);
  return actions;
}

function changeTransactionState(
  actions: any[],
  callback: Callback,
  ctPayment: any,
): any[] {
  const operation = callback.callback.operation;
  const transaction = getTransactionByType(ctPayment.transactions, operation);

  if (["refund", "reversal"].includes(operation.type) && !transaction) {
    return createRefundTransaction(actions, operation);
  }

  const newState = paymentStatusMap[operation.status] || "Pending";

  if (newState !== transaction.state) {
    actions.push({
      action: "changeTransactionState",
      transactionId: transaction.id,
      state: newState,
    });
  }
  return actions;
}

function changeTransactionInteractionId(
  actions: any[],
  callback: Callback,
  ctPayment: any,
): any[] {
  const action: {
    action: string;
    transactionId: string;
    interactionId: string;
  } = {
    action: "changeTransactionInteractionId",
    transactionId: "",
    interactionId: "",
  };
  const operation = callback.callback.operation;
  const transaction = getTransactionByType(ctPayment.transactions, operation);

  //return if received error without operation.id
  if (!operation.id) {
    return actions;
  }
  
  if (["refund", "reversal"].includes(operation.type) && !transaction) {
    return createRefundTransaction(actions, operation);
  }

  if (operation.id != transaction.id) {
    action.transactionId = transaction.id;
    action.interactionId = operation.id.toString();
  }
  actions.push(action);
  return actions;
}

function createRefundTransaction(actions: any[], operation: any): any[] {
  if (actionsContainCreateRefundTransaction(actions)) {
    return actions;
  }
  const dateTimeNow: Date = new Date();
  actions.push({
    action: "addTransaction",
    transaction: {
      timestamp: dateTimeNow.toISOString(),
      type: "Refund",
      amount: {
        centAmount: operation.sum_initial.amount,
        currencyCode: operation.sum_initial.currency,
      },
      interactionId: operation.id.toString(),
      state: paymentStatusMap[operation.status] || "Pending",
    },
  });
  return actions;
}

function actionsContainCreateRefundTransaction(actions: any[]): boolean {
  return (
    actions.find((e) => e.action === "addTransaction")?.transaction?.type ===
    "Refund"
  );
}

function getTransactionByType(transactions: [any], operation: any) {
  return transactions.find((transaction) => {
    if (operation.type === "sale") {
      return transaction.type === "Charge";
    }
    return [operation.request_id, operation.id].some(
      (id) => id == transaction.interactionId,
    );
  });
}

const paymentStatusMap: { [key: string]: string } = {
  processing: "Pending",
  "awaiting clarification": "Pending",
  "external processing": "Pending",
  "awaiting 3ds result": "Pending",
  success: "Success",
  decline: "Failure",
  "external error": "Failure",
  "internal error": "Failure",
};

function sortObjectByKey(object: any): any {
  return Object.keys(object)
    .sort()
    .reduce((obj: { [key: string]: any }, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
}

function listContainsObject(obj: any, list: []) {
  obj = sortObjectByKey(obj);
  return list.some(
    (item) => JSON.stringify(sortObjectByKey(item)) === JSON.stringify(obj),
  );
}
