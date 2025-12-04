// FILE: src/pages/api/categories.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.db) {
      throw new Error('Database not initialized');
    }

    const categories = await locals.db.getCategories();
    
    return new Response(JSON.stringify({ categories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get categories',
      categories: []
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

    const category = await request.json();
    
    if (!category.name) {
      return new Response(
        JSON.stringify({ error: 'Nome da categoria é obrigatório' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const newCategory = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    await locals.db.createCategory(newCategory);
    
    return new Response(JSON.stringify({ success: true, category: newCategory }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create category',
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

    const category = await request.json();
    
    if (!category.id) {
      return new Response(
        JSON.stringify({ error: 'ID da categoria é obrigatório' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    await locals.db.updateCategory(category.id, category);
    
    return new Response(JSON.stringify({ success: true, category }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update category',
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
        JSON.stringify({ error: 'ID da categoria é obrigatório' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    await locals.db.deleteCategory(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};