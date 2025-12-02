-- FILE: schema.sql (atualizado com hero_image)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  sensor_notes TEXT,
  ideal_for TEXT,
  price_per_liter REAL NOT NULL,
  available_sizes TEXT NOT NULL,
  image_url TEXT,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  payment_method TEXT NOT NULL,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_date TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('whatsapp', '"(11) 99999-9999"'),
  ('email', '"contato@chopehaus.com.br"'),
  ('instagram', '"@chopehaus"'),
  ('facebook', '"facebook.com/chopehaus"'),
  ('brandName', '"Chopehaus"'),
  ('workingHours', '"Seg-Sex: 9h às 18h | Sáb: 9h às 14h"'),
  ('heroImage', '"https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80"');

INSERT OR IGNORE INTO products (id, name, category, description, sensor_notes, ideal_for, price_per_liter, available_sizes, featured, active) VALUES
  ('pilsen-classico', 'Pilsen Clássico', 'Pilsen', 'Refrescante e equilibrado, com notas leves de malte e amargor suave.', 'Dourado brilhante, espuma cremosa', '15-30 convidados', 18.90, '[30, 50]', 1, 1),
  ('ipa-especial', 'IPA Especial', 'IPA', 'Intenso e aromático, com lúpulos americanos.', 'Dourado intenso, aroma tropical', '10-20 convidados', 24.90, '[30, 50]', 1, 1),
  ('trigo-leve', 'Trigo Leve', 'Weiss', 'Suave e cremoso, com toques de banana e cravo.', 'Cor palha turva, espuma densa', '20-40 convidados', 21.90, '[30, 50]', 1, 1);