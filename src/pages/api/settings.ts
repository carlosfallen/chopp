// FILE: src/pages/api/settings.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const settings = await locals.db.getSettings();
    
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get settings',
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

    const settings = await request.json();
    
    if (!settings.brandName || !settings.email || !settings.whatsapp) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    await locals.db.saveSettings(settings);
    
    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save settings',
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

    const settings = await request.json();
    
    await locals.db.saveSettings(settings);
    
    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};