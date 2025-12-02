// FILE: src/pages/api/upload.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('=== UPLOAD API STARTED ===');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('File info:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const arrayBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Se tiver runtime (produção), usar R2 diretamente
    if (locals.runtime?.env?.BUCKET) {
      console.log('Using Cloudflare R2 runtime');
      
      await locals.runtime.env.BUCKET.put(fileName, arrayBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      });

      const publicUrl = `https://pub-59d8b8edbc6f497984f8a95046b2263b.r2.dev/${fileName}`;
      
      return new Response(JSON.stringify({ url: publicUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Desenvolvimento: fazer upload via Workers API
    console.log('Using Workers API for upload');
    
    const WORKER_URL = 'https://chopp-delivery.jorge-ai.workers.dev/upload';
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([arrayBuffer], { type: file.type }), fileName);
    
    const workerResponse = await fetch(WORKER_URL, {
      method: 'POST',
      body: uploadFormData
    });

    if (!workerResponse.ok) {
      throw new Error(`Worker upload failed: ${workerResponse.status}`);
    }

    const result = await workerResponse.json();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};