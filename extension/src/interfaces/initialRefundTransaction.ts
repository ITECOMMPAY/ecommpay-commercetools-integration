interface InitialRefundTransaction {
  type: string;
  state: string;
  amount: {
    centAmount: number;
    currencyCode: string;
  };
}
export default InitialRefundTransaction;
