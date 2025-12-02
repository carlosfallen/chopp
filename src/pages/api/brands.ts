// FILE: src/pages/api/brands.ts (corrigido)
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const brands = await locals.db.getBrands();
    
    return new Response(JSON.stringify({ brands }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting brands:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get brands',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const brand = await request.json();
    
    if (!brand.id) {
      brand.id = `brand-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    }

    if (!brand.order) {
      const brands = await locals.db.getBrands();
      brand.order = brands.length + 1;
    }
    
    await locals.db.createBrand(brand);
    
    return new Response(JSON.stringify({ success: true, brand }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create brand',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const brand = await request.json();
    
    await locals.db.updateBrand(brand);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update brand',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const { id } = await request.json();
    
    await locals.db.deleteBrand(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete brand',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};