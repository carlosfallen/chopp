// FILE: src/pages/api/brands.ts (atualizado para D1)
import type { APIRoute } from 'astro';
import { Database } from '../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = new Database(locals.runtime.env.DB);
    const brands = await db.getBrands();
    
    return new Response(JSON.stringify({ brands }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting brands:', error);
    return new Response(JSON.stringify({ error: 'Failed to get brands' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const brand = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    if (!brand.id) {
      brand.id = `brand-${Date.now()}`;
    }
    
    await db.createBrand(brand);
    
    return new Response(JSON.stringify({ success: true, brand }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    return new Response(JSON.stringify({ error: 'Failed to create brand' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const brand = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.updateBrand(brand);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return new Response(JSON.stringify({ error: 'Failed to update brand' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const { id } = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.deleteBrand(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete brand' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};