type CACHE_TAG = 'products' | 'categories' | 'carts' | 'cartItems';

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}
export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${tag}-${id}` as const;
}
