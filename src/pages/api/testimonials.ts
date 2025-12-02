// FILE: src/pages/api/testimonials.ts (corrigido)
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const testimonials = await locals.db.getTestimonials();
    
    return new Response(JSON.stringify({ testimonials }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get testimonials',
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

    const testimonial = await request.json();
    
    if (!testimonial.id) {
      testimonial.id = `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    }
    
    await locals.db.createTestimonial(testimonial);
    
    return new Response(JSON.stringify({ success: true, testimonial }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create testimonial',
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

    const testimonial = await request.json();
    
    await locals.db.updateTestimonial(testimonial);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update testimonial',
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
    
    await locals.db.deleteTestimonial(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete testimonial',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};