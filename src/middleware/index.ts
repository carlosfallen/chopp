// FILE: src/middleware/index.ts (remover parâmetro não usado)
import { defineMiddleware } from 'astro:middleware';
import { Database } from '../lib/db';

export const onRequest = defineMiddleware(async ({ locals }, next) => {
  if (locals.runtime?.env?.DB) {
    locals.db = new Database(locals.runtime.env.DB);
  }
  
  return next();
});