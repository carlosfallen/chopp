-- Produtos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  sensor_notes TEXT,
  ideal_for TEXT,
  price_per_liter REAL NOT NULL,
  available_sizes TEXT NOT NULL, -- JSON array
  image_url TEXT,
  featured BOOLEAN DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configurações do site
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text', -- text, json, image
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Imagens
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- hero, product, brand, etc
  alt TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos (para histórico)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  event_date DATE NOT NULL,
  items TEXT NOT NULL, -- JSON
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Marcas parceiras
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT 1
);

-- Depoimentos
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  event_type TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão
INSERT INTO site_settings (key, value, type) VALUES 
('site_name', 'NOME_DA_MARCA', 'text'),
('hero_title', 'Chopp de bar na sua casa, sem complicação', 'text'),
('hero_subtitle', 'Chopeira gratuita, entrega rápida e instalação profissional', 'text'),
('whatsapp_number', '5511999999999', 'text'),
('contact_email', 'contato@nomedamarca.com.br', 'text'),
('hero_image', '', 'image'),
('about_text', 'Somos especialistas em chopp delivery...', 'text');