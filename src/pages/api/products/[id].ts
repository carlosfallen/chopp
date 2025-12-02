// FILE: src/pages/api/products/[id].ts (corrigido)
import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const product = await request.json();
    
    if (!product.id) {
      product.id = params.id;
    }
    
    await locals.db.updateProduct(product);
    
    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const { id } = params;
    if (!id) {
      throw new Error('ID required');
    }
    
    await locals.db.deleteProduct(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};