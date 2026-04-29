export type ActionSuccess<T = void> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionError = {
  success: false;
  error: string; //for toast
  code: ErrorCode; //for logic
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

export enum ErrorCode {
  // Cart
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  // Product
  PRODUCT_OUT_OF_STOCK = 'PRODUCT_OUT_OF_STOCK',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  // Generic
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNEXPECTED = 'UNEXPECTED',
}

export const ok = <T>(data: T, message?: string): ActionSuccess<T> => ({
  success: true,
  data,
  message,
});
export const okVoid = (message?: string): ActionSuccess => ({
  success: true,
  data: undefined,
  message,
});

export const err = (
  error: string,
  code: ErrorCode = ErrorCode.UNEXPECTED,
  fieldErrors?: Record<string, string[]>,
): ActionError => ({
  success: false,
  error,
  code,
  fieldErrors,
});
