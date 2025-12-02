// FILE: src/pages/api/health.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: {
      hasRuntime: !!locals.runtime,
      hasEnv: !!locals.runtime?.env,
      hasDB: !!locals.runtime?.env?.DB,
      hasBucket: !!locals.runtime?.env?.BUCKET,
      hasCache: !!locals.runtime?.env?.CACHE,
    },
    db: {
      initialized: !!locals.db
    }
  };

  // Testar conexão com DB
  if (locals.db) {
    try {
      const settings = await locals.db.getSettings();
      health.db = {
        initialized: true,
        connected: true,
        settingsCount: Object.keys(settings).length
      };
    } catch (error) {
      health.db = {
        initialized: true,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return new Response(JSON.stringify(health, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};