// FILE: src/lib/db.ts
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  sensorNotes: string;
  idealFor: string;
  pricePerLiter: number;
  availableSizes: number[];
  imageUrl?: string;
  featured: boolean;
  active: boolean;
}

export interface Settings {
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  brandName: string;
  workingHours: string;
  heroImage: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  event: string;
  rating: number;
  text: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    productName: string;
    liters: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryDate?: string;
  address?: string;
}

export class Database {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async getSettings(): Promise<Settings> {
    const results = await this.db.prepare('SELECT key, value FROM settings').all();
    
    const settings: any = {};
    results.results.forEach((row: any) => {
      settings[row.key] = JSON.parse(row.value);
    });

    return settings as Settings;
  }

  async saveSetting(key: string, value: string): Promise<void> {
    await this.db.prepare(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).bind(key, JSON.stringify(value)).run();
  }

  async saveSettings(settings: Settings): Promise<void> {
    const keys = Object.keys(settings) as Array<keyof Settings>;
    
    for (const key of keys) {
      await this.saveSetting(key, settings[key]);
    }
  }

  async getProducts(): Promise<Product[]> {
    const results = await this.db.prepare(
      'SELECT * FROM products ORDER BY featured DESC, name ASC'
    ).all();

    return results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      sensorNotes: row.sensor_notes,
      idealFor: row.ideal_for,
      pricePerLiter: row.price_per_liter,
      availableSizes: JSON.parse(row.available_sizes),
      imageUrl: row.image_url,
      featured: row.featured === 1,
      active: row.active === 1
    }));
  }

  async getProduct(id: string): Promise<Product | null> {
    const result = await this.db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      category: result.category,
      description: result.description,
      sensorNotes: result.sensor_notes,
      idealFor: result.ideal_for,
      pricePerLiter: result.price_per_liter,
      availableSizes: JSON.parse(result.available_sizes as string),
      imageUrl: result.image_url,
      featured: result.featured === 1,
      active: result.active === 1
    } as Product;
  }

  async createProduct(product: Product): Promise<void> {
    await this.db.prepare(`
      INSERT INTO products (
        id, name, category, description, sensor_notes, ideal_for,
        price_per_liter, available_sizes, image_url, featured, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.id,
      product.name,
      product.category,
      product.description,
      product.sensorNotes,
      product.idealFor,
      product.pricePerLiter,
      JSON.stringify(product.availableSizes),
      product.imageUrl || null,
      product.featured ? 1 : 0,
      product.active ? 1 : 0
    ).run();
  }

  async updateProduct(product: Product): Promise<void> {
    await this.db.prepare(`
      UPDATE products SET
        name = ?, category = ?, description = ?, sensor_notes = ?,
        ideal_for = ?, price_per_liter = ?, available_sizes = ?,
        image_url = ?, featured = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      product.name,
      product.category,
      product.description,
      product.sensorNotes,
      product.idealFor,
      product.pricePerLiter,
      JSON.stringify(product.availableSizes),
      product.imageUrl || null,
      product.featured ? 1 : 0,
      product.active ? 1 : 0,
      product.id
    ).run();
  }

  async deleteProduct(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  }

  async getBrands(): Promise<Brand[]> {
    const results = await this.db.prepare(
      'SELECT * FROM brands ORDER BY order_index ASC'
    ).all();

    return results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url,
      order: row.order_index,
      active: row.active === 1
    }));
  }

  async createBrand(brand: Brand): Promise<void> {
    await this.db.prepare(`
      INSERT INTO brands (id, name, logo_url, order_index, active)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      brand.id,
      brand.name,
      brand.logoUrl || null,
      brand.order,
      brand.active ? 1 : 0
    ).run();
  }

  async updateBrand(brand: Brand): Promise<void> {
    await this.db.prepare(`
      UPDATE brands SET
        name = ?, logo_url = ?, order_index = ?, active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      brand.name,
      brand.logoUrl || null,
      brand.order,
      brand.active ? 1 : 0,
      brand.id
    ).run();
  }

  async deleteBrand(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM brands WHERE id = ?').bind(id).run();
  }

  async getTestimonials(): Promise<Testimonial[]> {
    const results = await this.db.prepare(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    ).all();

    return results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      event: row.event,
      rating: row.rating,
      text: row.text,
      active: row.active === 1
    }));
  }

  async createTestimonial(testimonial: Testimonial): Promise<void> {
    await this.db.prepare(`
      INSERT INTO testimonials (id, name, event, rating, text, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      testimonial.id,
      testimonial.name,
      testimonial.event,
      testimonial.rating,
      testimonial.text,
      testimonial.active ? 1 : 0
    ).run();
  }

  async updateTestimonial(testimonial: Testimonial): Promise<void> {
    await this.db.prepare(`
      UPDATE testimonials SET
        name = ?, event = ?, rating = ?, text = ?, active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      testimonial.name,
      testimonial.event,
      testimonial.rating,
      testimonial.text,
      testimonial.active ? 1 : 0,
      testimonial.id
    ).run();
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM testimonials WHERE id = ?').bind(id).run();
  }

  async getOrders(): Promise<Order[]> {
    const results = await this.db.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all();

    return results.results.map((row: any) => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      paymentMethod: row.payment_method,
      items: JSON.parse(row.items),
      total: row.total,
      status: row.status,
      createdAt: row.created_at,
      deliveryDate: row.delivery_date,
      address: row.address
    }));
  }

  async createOrder(order: Order): Promise<void> {
    await this.db.prepare(`
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_email, payment_method,
        items, total, status, delivery_date, address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      order.id,
      order.customerName,
      order.customerPhone,
      order.customerEmail || null,
      order.paymentMethod,
      JSON.stringify(order.items),
      order.total,
      order.status,
      order.deliveryDate || null,
      order.address || null,
      order.createdAt
    ).run();
  }

  async updateOrder(id: string, order: Partial<Order>): Promise<void> {
    const existingOrder = await this.db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();

    if (!existingOrder) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      customer_name: order.customerName ?? existingOrder.customer_name,
      customer_phone: order.customerPhone ?? existingOrder.customer_phone,
      customer_email: order.customerEmail ?? existingOrder.customer_email,
      payment_method: order.paymentMethod ?? existingOrder.payment_method,
      items: order.items ? JSON.stringify(order.items) : existingOrder.items,
      total: order.total ?? existingOrder.total,
      status: order.status ?? existingOrder.status,
      delivery_date: order.deliveryDate !== undefined ? order.deliveryDate : existingOrder.delivery_date,
      address: order.address !== undefined ? order.address : existingOrder.address,
    };

    await this.db.prepare(`
      UPDATE orders SET
        customer_name = ?, customer_phone = ?, customer_email = ?, payment_method = ?,
        items = ?, total = ?, status = ?, delivery_date = ?,
        address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      updatedOrder.customer_name,
      updatedOrder.customer_phone,
      updatedOrder.customer_email,
      updatedOrder.payment_method,
      updatedOrder.items,
      updatedOrder.total,
      updatedOrder.status,
      updatedOrder.delivery_date,
      updatedOrder.address,
      id
    ).run();
  }

  async deleteOrder(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();
  }

  async getCategories(): Promise<Category[]> {
    const results = await this.db.prepare(
      'SELECT * FROM categories ORDER BY name ASC'
    ).all();

    return results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      createdAt: row.created_at
    }));
  }

  async createCategory(category: Category): Promise<void> {
    await this.db.prepare(`
      INSERT INTO categories (id, name, description, icon, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      category.id,
      category.name,
      category.description || null,
      category.icon || '🍺',
      category.createdAt || new Date().toISOString()
    ).run();
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const existingCategory = await this.db.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first();

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.db.prepare(`
      UPDATE categories SET
        name = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      category.name ?? existingCategory.name,
      category.description !== undefined ? category.description : existingCategory.description,
      category.icon ?? existingCategory.icon,
      id
    ).run();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  }
}