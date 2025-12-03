// FILE: src/lib/database.ts (adicionar métodos)
// Adicione estes métodos na classe Database:

async getCategories() {
  const result = await this.db.prepare('SELECT * FROM categories ORDER BY name').all();
  return result.results || [];
}

async createCategory(category: any) {
  await this.db.prepare(`
    INSERT INTO categories (id, name, description, icon, createdAt)
    VALUES (?1, ?2, ?3, ?4, ?5)
  `).bind(
    category.id,
    category.name,
    category.description || '',
    category.icon || '🍺',
    category.createdAt
  ).run();
}

async updateCategory(id: string, category: any) {
  await this.db.prepare(`
    UPDATE categories 
    SET name = ?1, description = ?2, icon = ?3
    WHERE id = ?4
  `).bind(
    category.name,
    category.description || '',
    category.icon || '🍺',
    id
  ).run();
}

async deleteCategory(id: string) {
  await this.db.prepare('DELETE FROM categories WHERE id = ?1').bind(id).run();
}

async getOrders() {
  const result = await this.db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  return (result.results || []).map((order: any) => ({
    ...order,
    items: JSON.parse(order.items)
  }));
}

async createOrder(order: any) {
  await this.db.prepare(`
    INSERT INTO orders (id, customerName, customerPhone, customerEmail, items, total, status, createdAt, address)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
  `).bind(
    order.id,
    order.customerName,
    order.customerPhone,
    order.customerEmail || '',
    JSON.stringify(order.items),
    order.total,
    order.status,
    order.createdAt,
    order.address || ''
  ).run();
}

async updateOrder(id: string, order: any) {
  await this.db.prepare(`
    UPDATE orders 
    SET status = ?1, customerName = ?2, customerPhone = ?3, address = ?4
    WHERE id = ?5
  `).bind(
    order.status,
    order.customerName,
    order.customerPhone,
    order.address || '',
    id
  ).run();
}

async deleteOrder(id: string) {
  await this.db.prepare('DELETE FROM orders WHERE id = ?1').bind(id).run();
}