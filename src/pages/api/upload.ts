// FILE: src/pages/api/upload.ts (atualizado para R2)
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;

    // Upload para R2
    await locals.runtime.env.BUCKET.put(fileName, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    });

    // URL pública (configure seu domínio custom no Cloudflare)
    const publicUrl = `https://f19932f2396bfc72bd1f3d6be3c68c9f.r2.cloudflarestorage.com/chopp-delivery`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};