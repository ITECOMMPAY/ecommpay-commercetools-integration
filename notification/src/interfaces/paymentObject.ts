// https://docs.commercetools.com/api/projects/payments#payment

import Transaction from "./transaction";

interface PaymentObject {
  id: string;
  version: number;
  transactions: Transaction[];
}

export default PaymentObject;
