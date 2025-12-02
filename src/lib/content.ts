// FILE: src/lib/content.ts (atualizado para SSR)
import type { AstroGlobal } from 'astro';
import { Database } from './db';

export async function getSettings(Astro: AstroGlobal) {
  try {
    const db = new Database(Astro.locals.runtime.env.DB);
    return await db.getSettings();
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      whatsapp: '(11) 99999-9999',
      email: 'contato@nomedamarca.com.br',
      instagram: '@nomedamarca',
      facebook: 'facebook.com/nomedamarca',
      brandName: 'NOME_DA_MARCA',
      workingHours: 'Seg-Sex: 9h às 18h | Sáb: 9h às 14h'
    };
  }
}

export async function getBrands(Astro: AstroGlobal) {
  try {
    const db = new Database(Astro.locals.runtime.env.DB);
    const brands = await db.getBrands();
    return brands.filter(b => b.active);
  } catch (error) {
    console.error('Error loading brands:', error);
    return [];
  }
}

export async function getTestimonials(Astro: AstroGlobal) {
  try {
    const db = new Database(Astro.locals.runtime.env.DB);
    const testimonials = await db.getTestimonials();
    return testimonials.filter(t => t.active);
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
}

export async function getProducts(Astro: AstroGlobal) {
  try {
    const db = new Database(Astro.locals.runtime.env.DB);
    const products = await db.getProducts();
    return products.filter(p => p.active);
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback para produtos padrão
    const { products } = await import('../data/products');
    return products;
  }
}