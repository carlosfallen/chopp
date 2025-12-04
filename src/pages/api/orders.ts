// FILE: src/pages/api/orders.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const orders = await locals.db.getOrders();
    
    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get orders',
      orders: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const order = await request.json();
    
    if (!order.customerName || !order.customerPhone || !order.items || order.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const newOrder = {
      ...order,
      id: order.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || 'pending'
    };
    
    await locals.db.createOrder(newOrder);
    
    return new Response(JSON.stringify({ success: true, order: newOrder }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create order',
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

    const order = await request.json();
    
    if (!order.id) {
      return new Response(
        JSON.stringify({ error: 'ID do pedido é obrigatório' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    await locals.db.updateOrder(order.id, order);
    
    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update order',
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
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID do pedido é obrigatório' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    await locals.db.deleteOrder(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};