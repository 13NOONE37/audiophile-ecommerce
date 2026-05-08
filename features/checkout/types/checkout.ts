export type StockValidationResult = {
  isValid: boolean;
  adjustedItems: AdjustedItem[];
};

export type AdjustedItem = {
  name: string;
  requestedQty: number;
  availableQty: number; // 0 = unavaible
};

export type PlaceOrderResult = {
  confirmationToken: string;
  orderId: string;
};
