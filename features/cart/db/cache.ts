import { getIdTag } from '@/lib/dataCache';

export function getCartIdTag(id: string) {
  return getIdTag('carts', id);
}
export function getCartItemsIdTag(id: string) {
  return getIdTag('cartItems', id);
}
