// FILE: src/pages/api/testimonials.ts (atualizado para D1)
import type { APIRoute } from 'astro';
import { Database } from '../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = new Database(locals.runtime.env.DB);
    const testimonials = await db.getTestimonials();
    
    return new Response(JSON.stringify({ testimonials }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return new Response(JSON.stringify({ error: 'Failed to get testimonials' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const testimonial = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    if (!testimonial.id) {
      testimonial.id = `testimonial-${Date.now()}`;
    }
    
    await db.createTestimonial(testimonial);
    
    return new Response(JSON.stringify({ success: true, testimonial }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return new Response(JSON.stringify({ error: 'Failed to create testimonial' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const testimonial = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.updateTestimonial(testimonial);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return new Response(JSON.stringify({ error: 'Failed to update testimonial' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const { id } = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.deleteTestimonial(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete testimonial' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};