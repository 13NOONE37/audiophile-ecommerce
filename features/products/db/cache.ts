import { getCategoryIdTag } from '@/features/categories/db/cache';
import { getGlobalTag, getIdTag } from '@/lib/dataCache';

export function getProductGlobalTag() {
  return getGlobalTag('products');
}

export function getProductIdTag(id: string) {
  return getIdTag('products', id);
}

export function getCategoryIdProductsTag(categoryId: string) {
  return `${getCategoryIdTag(categoryId)}-products`;
}
