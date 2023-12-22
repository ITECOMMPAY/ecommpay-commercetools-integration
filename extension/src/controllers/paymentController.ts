import generatePPFlowService from "../services/flows/generatePPFlowService";
import refundFlowService from "../services/flows/refundFlowService";
import { InvalidJsonInput } from "../helpers/errors";

async function proceedRequest(body: string | object | null): Promise<any> {
  const requestParams = getCtPaymentFromBody(body);
  const ctPayment = requestParams.resource.obj;

  if (requestParams.action === "Create") {
    return generatePPFlowService(ctPayment);
  }

  if (requestParams.action === "Update") {
    return await refundFlowService(ctPayment);
  }
  return { actions: [] };
}

function getCtPaymentFromBody(body: string | object | null): any {
  if (body === null) {
    throw new InvalidJsonInput("Received empty body");
  }
  
  if (typeof body === "object") {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (error: any) {
    throw new InvalidJsonInput(error.message);
  }
}

export default proceedRequest;
