// lib/arcjet.ts
import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/next';
import { env } from '@/data/env/server';

export const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [shield({ mode: 'LIVE' })],
});

export const ajCheckout = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    shield({ mode: 'LIVE' }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 2,
      interval: 60,
      capacity: 5,
    }),
  ],
});

export const ajCart = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    shield({ mode: 'LIVE' }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 20,
      interval: 60,
      capacity: 20,
    }),
  ],
});

export const ajPayment = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    shield({ mode: 'LIVE' }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 1,
      interval: 60,
      capacity: 3,
    }),
  ],
});
