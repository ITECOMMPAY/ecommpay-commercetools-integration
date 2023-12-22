import InitialRefundTransaction from "./initialRefundTransaction";
import { IncomingMessage } from "http";

interface CommerceToolsRequestObject extends IncomingMessage {
  action: string;
  resource: {
    obj: {
      id: string;
      transactions: InitialRefundTransaction[];
      amountPlanned: {
        centAmount: number;
        currencyCode: string;
      };
      lastModifiedBy: {
        clientId: string;
      };
    };
  };
}

export default CommerceToolsRequestObject;
