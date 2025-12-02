// FILE: src/pages/api/products/[id].ts (atualizado)
import type { APIRoute } from 'astro';
import { Database } from '../../../lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const product = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.updateProduct(product);
    
    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;
    if (!id) throw new Error('ID required');
    
    const db = new Database(locals.runtime.env.DB);
    await db.deleteProduct(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};