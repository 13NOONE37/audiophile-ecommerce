import { Cart, CartOptimisticAction } from './types/cart';

export function cartReducer(cart: Cart, action: CartOptimisticAction): Cart {
  if (!cart) return cart;
  switch (action.type) {
    case 'UPDATE_QUANTITY':
      return {
        ...cart,
        items: cart.items
          .map((item) =>
            item.id === action.itemId
              ? { ...item, quantity: action.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0), //quantity 0 = item removed
      };
    case 'REMOVE_ITEM':
      return {
        ...cart,
        items: cart.items.filter((item) => item.id !== action.itemId),
      };
    case 'CLEAR':
      return { ...cart, items: [] };
  }
}
