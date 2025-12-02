// FILE: src/middleware/index.ts
import { defineMiddleware } from 'astro:middleware';
import { Database } from '../lib/db';

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  console.log('=== MIDDLEWARE ===');
  console.log('Request URL:', request.url);
  console.log('Has runtime:', !!locals.runtime);
  
  if (locals.runtime) {
    console.log('Runtime env keys:', Object.keys(locals.runtime.env || {}));
  }
  
  if (locals.runtime?.env?.DB) {
    locals.db = new Database(locals.runtime.env.DB);
    console.log('Database initialized');
  }
  
  return next();
});