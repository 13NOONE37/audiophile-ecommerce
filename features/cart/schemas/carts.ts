import z from 'zod';

export const addToCartSchema = z.object({
  variantId: z.uuid(),
  quantity: z.number().int().min(1),
});

export const updateQuantitySchema = z.object({
  cartItemId: z.uuid(),
  quantity: z.number().int().min(0),
});
