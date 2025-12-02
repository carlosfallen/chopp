// FILE: src/pages/api/settings.ts (atualizado para D1)
import type { APIRoute } from 'astro';
import { Database } from '../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = new Database(locals.runtime.env.DB);
    const settings = await db.getSettings();
    
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return new Response(JSON.stringify({ error: 'Failed to get settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const settings = await request.json();
    const db = new Database(locals.runtime.env.DB);
    
    await db.saveSettings(settings);
    
    return new Response(JSON.stringify({ success: true, settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return new Response(JSON.stringify({ error: 'Failed to save settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};