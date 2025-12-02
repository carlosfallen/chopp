// FILE: src/pages/api/layout-config.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      return new Response(JSON.stringify({
        heroTitle: 'Chopp de Bar\nNa Sua Casa\nSem Complicação',
        heroSubtitle: 'Chopeira profissional gratuita, entrega express e instalação completa. Transforme qualquer momento em celebração.',
        heroImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200&q=80',
        backgroundColor: '#0a0a0a',
        primaryColor: '#d4af37',
        secondaryColor: '#ffbf00',
        showStats: true,
        showBadge: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const settings = await locals.db.getSettings();

    return new Response(JSON.stringify({
      heroTitle: settings.heroTitle || 'Chopp de Bar\nNa Sua Casa\nSem Complicação',
      heroSubtitle: settings.heroSubtitle || 'Chopeira profissional gratuita, entrega express e instalação completa.',
      heroImage: settings.heroImage || 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200&q=80',
      backgroundColor: settings.backgroundColor || '#0a0a0a',
      primaryColor: settings.primaryColor || '#d4af37',
      secondaryColor: settings.secondaryColor || '#ffbf00',
      showStats: settings.showStats !== false,
      showBadge: settings.showBadge !== false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting layout config:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get layout config',
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

    const config = await request.json();

    // Salvar cada configuração individualmente
    const keys = [
      'heroTitle', 'heroSubtitle', 'heroImage',
      'backgroundColor', 'primaryColor', 'secondaryColor',
      'showStats', 'showBadge'
    ];

    for (const key of keys) {
      if (config[key] !== undefined) {
        await locals.db.saveSetting(key, config[key]);
      }
    }

    return new Response(JSON.stringify({ success: true, config }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving layout config:', error);
    return new Response(JSON.stringify({
      error: 'Failed to save layout config',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
