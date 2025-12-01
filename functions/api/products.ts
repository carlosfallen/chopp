// functions/api/products.ts
export async function onRequest(context: any) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const productId = pathParts[pathParts.length - 1];
    
    // GET all products
    if (request.method === 'GET' && !productId) {
      const { results } = await env.DB.prepare(
        'SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, created_at DESC'
      ).all();
      
      return Response.json({ 
        products: results.map(p => ({
          ...p,
          availableSizes: JSON.parse(p.available_sizes)
        }))
      }, { headers: corsHeaders });
    }
    
    // GET single product
    if (request.method === 'GET' && productId) {
      const product = await env.DB.prepare(
        'SELECT * FROM products WHERE id = ?'
      ).bind(productId).first();
      
      if (!product) {
        return Response.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
      }
      
      return Response.json({ 
        product: {
          ...product,
          availableSizes: JSON.parse(product.available_sizes)
        }
      }, { headers: corsHeaders });
    }
    
    // CREATE product
    if (request.method === 'POST') {
      const data = await request.json();
      const id = crypto.randomUUID();
      
      await env.DB.prepare(`
        INSERT INTO products (
          id, name, category, description, sensor_notes, ideal_for,
          price_per_liter, available_sizes, image_url, featured, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.name,
        data.category,
        data.description,
        data.sensorNotes,
        data.idealFor,
        data.pricePerLiter,
        JSON.stringify(data.availableSizes),
        data.imageUrl || null,
        data.featured ? 1 : 0,
        data.active ? 1 : 0
      ).run();
      
      return Response.json({ success: true, id }, { headers: corsHeaders });
    }
    
    // UPDATE product
    if (request.method === 'PUT' && productId) {
      const data = await request.json();
      
      await env.DB.prepare(`
        UPDATE products SET
          name = ?, category = ?, description = ?, sensor_notes = ?,
          ideal_for = ?, price_per_liter = ?, available_sizes = ?,
          image_url = ?, featured = ?, active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        data.name,
        data.category,
        data.description,
        data.sensorNotes,
        data.idealFor,
        data.pricePerLiter,
        JSON.stringify(data.availableSizes),
        data.imageUrl || null,
        data.featured ? 1 : 0,
        data.active ? 1 : 0,
        productId
      ).run();
      
      return Response.json({ success: true }, { headers: corsHeaders });
    }
    
    // DELETE product
    if (request.method === 'DELETE' && productId) {
      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }
    
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}