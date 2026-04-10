import { getIdTag } from '@/lib/dataCache';

export function getCartIdTag(id: string) {
  return getIdTag('carts', id);
}
