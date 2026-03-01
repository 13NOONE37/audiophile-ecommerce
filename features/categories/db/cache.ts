import { getGlobalTag, getIdTag } from '@/lib/dataCache';

export function getCategoryGlobalTag() {
  return getGlobalTag('categories');
}

export function getCategoryIdTag(id: string) {
  return getIdTag('categories', id);
}
