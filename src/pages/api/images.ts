// FILE: src/pages/api/images.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = locals.runtime;

    if (!runtime?.env?.BUCKET) {
      // Em desenvolvimento, retorna lista vazia ou mock
      return new Response(JSON.stringify({
        images: [],
        message: 'R2 bucket not available in this environment'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bucket = runtime.env.BUCKET;

    // Lista todos os objetos no bucket
    const listed = await bucket.list();

    const images = listed.objects.map((obj: any) => ({
      key: obj.key,
      url: `https://pub-59d8b8edbc6f497984f8a95046b2263b.r2.dev/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded
    }));

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error listing images:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
