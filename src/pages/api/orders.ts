// FILE: src/pages/api/orders.ts (atualizado para D1)
import type { APIRoute } from 'astro';
import { Database } from '../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = new Database(locals.runtime.env.DB);
    const orders = await db.getOrders();
    
    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to get orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const order = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    if (!order.id) {
      order.id = `order-${Date.now()}`;
    }
    
    if (!order.createdAt) {
      order.createdAt = new Date().toISOString();
    }
    
    await db.createOrder(order);
    
    return new Response(JSON.stringify({ success: true, order }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const order = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.updateOrder(order);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to update order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};