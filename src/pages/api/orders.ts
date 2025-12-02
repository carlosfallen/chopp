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
      console.error('❌ Database not initialized in locals');
      return new Response(JSON.stringify({
        error: 'Database not initialized',
        details: 'O banco de dados não está disponível no momento. Tente novamente em alguns instantes.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const order = await request.json();
    console.log('📦 Received order:', JSON.stringify(order, null, 2));

    // Validações
    if (!order.customerName || !order.customerPhone) {
      return new Response(JSON.stringify({
        error: 'Invalid order data',
        details: 'Nome e telefone são obrigatórios'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid order data',
        details: 'O pedido deve conter pelo menos um item'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Garantir campos obrigatórios
    if (!order.id) {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).slice(2, 7);
      order.id = `${timestamp}-${randomStr}`;
    }

    if (!order.createdAt) {
      order.createdAt = new Date().toISOString();
    }

    if (!order.status) {
      order.status = 'pending';
    }

    if (!order.paymentMethod) {
      order.paymentMethod = 'pendente';
    }

    console.log('💾 Creating order in database:', order.id);
    await locals.db.createOrder(order);
    console.log('✅ Order created successfully:', order.id);

    return new Response(JSON.stringify({ success: true, order }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Se for erro do SQLite, fornecer mensagem mais clara
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let userMessage = 'Erro ao criar pedido. Tente novamente.';

    if (errorMessage.includes('no such table')) {
      userMessage = 'Banco de dados não inicializado. Contate o suporte.';
    } else if (errorMessage.includes('UNIQUE constraint')) {
      userMessage = 'Este pedido já foi criado.';
    }

    return new Response(JSON.stringify({
      error: 'Failed to create order',
      details: userMessage,
      technicalDetails: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
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
    
    await locals.db.updateOrder(order);
    
    return new Response(JSON.stringify({ success: true }), {
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