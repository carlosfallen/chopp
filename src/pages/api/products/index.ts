// FILE: src/pages/api/products/index.ts (atualizado)
import type { APIRoute } from 'astro';
import { Database } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = new Database(locals.runtime.env.DB);
    const products = await db.getProducts();
    
    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return new Response(JSON.stringify({ error: 'Failed to get products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const product = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    if (!product.id) {
      product.id = `product-${Date.now()}`;
    }
    
    await db.createProduct(product);
    
    return new Response(JSON.stringify({ success: true, product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};