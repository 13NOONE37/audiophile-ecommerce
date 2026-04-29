import { ErrorCode } from '../types/actionResults';

export class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class CartNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.CART_NOT_FOUND, 'Cart was not found');
  }
}
export class CartItemNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.CART_ITEM_NOT_FOUND, 'Cart item was not found');
  }
}

export class ProductNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.PRODUCT_NOT_FOUND, 'Product was not found');
  }
}

export class OutOfStockError extends DomainError {
  constructor(
    productName: string,
    available: number,
    mode: 'add' | 'update' = 'add',
  ) {
    const message =
      available === 0
        ? `"${productName}" is out of stock`
        : mode === 'add'
          ? `You can only add ${available} more "${productName}"`
          : `Only ${available} left for "${productName}"`;

    super(ErrorCode.PRODUCT_OUT_OF_STOCK, message);
  }
}
