interface Transaction {
  id: string;
  type: string;
  state: string;
  amount: {
    centAmount: number;
    currencyCode: string;
  };
  interactionId: string;
}
export default Transaction;
