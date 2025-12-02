-- FILE: schema.sql
-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Marcas
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  order_index INTEGER NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Depoimentos
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_date TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão
INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('brandName', '"NOME_DA_MARCA"'),
  ('whatsapp', '"(11) 99999-9999"'),
  ('email', '"contato@nomedamarca.com.br"'),
  ('instagram', '"@nomedamarca"'),
  ('facebook', '"facebook.com/nomedamarca"'),
  ('workingHours', '"Seg-Sex: 9h às 18h | Sáb: 9h às 14h"');

-- Inserir marcas padrão
INSERT OR IGNORE INTO brands (id, name, logo_url, order_index, active) VALUES
  ('1', 'Marca A', '', 1, 1),
  ('2', 'Marca B', '', 2, 1),
  ('3', 'Marca C', '', 3, 1),
  ('4', 'Marca D', '', 4, 1),
  ('5', 'Marca E', '', 5, 1),
  ('6', 'Marca F', '', 6, 1);

-- Inserir depoimentos padrão
INSERT OR IGNORE INTO testimonials (id, name, event, rating, text, active) VALUES
  ('1', 'Mariana S.', 'Aniversário de 30 anos', 5, 'Chopp gelado e saboroso, chopeira impecável e a equipe super atenciosa. Minha festa foi um sucesso!', 1),
  ('2', 'Roberto M.', 'Confraternização empresa', 5, 'Processo super fácil, desde o pedido até a retirada. O chopp estava na temperatura perfeita!', 1),
  ('3', 'Paula & João', 'Casamento', 5, 'Melhor decisão foi contratar! Todos os convidados elogiaram a qualidade do chopp. Super recomendo!', 1),
  ('4', 'Carlos A.', 'Churrasco de família', 5, 'Atendimento nota 10! Tiraram todas as minhas dúvidas e entregaram tudo certinho. Experiência incrível!', 1);

-- Inserir produtos padrão
INSERT OR IGNORE INTO products (id, name, category, description, sensor_notes, ideal_for, price_per_liter, available_sizes, image_url, featured, active) VALUES
  ('pilsen-classico', 'Pilsen Clássico', 'Pilsen', 'Refrescante e equilibrado, com notas leves de malte e amargor suave. Perfeito para qualquer ocasião.', 'Dourado brilhante, espuma cremosa, final limpo', '15-30 convidados', 18.90, '[30,50]', '', 1, 1),
  ('ipa-especial', 'IPA Especial', 'IPA', 'Intenso e aromático, com lúpulos americanos que trazem notas cítricas e florais. Para apreciadores.', 'Dourado intenso, aroma tropical, amargor equilibrado', '10-20 convidados', 24.90, '[30,50]', '', 1, 1),
  ('trigo-leve', 'Trigo Leve', 'Weiss', 'Suave e cremoso, com toques de banana e cravo. Ideal para quem busca leveza e sabor marcante.', 'Cor palha turva, espuma densa, refrescância', '20-40 convidados', 21.90, '[30,50]', '', 1, 1),
  ('lager-premium', 'Lager Premium', 'Lager', 'Clássico sofisticado com maltes nobres europeus. Sabor redondo e final prolongado.', 'Dourado médio, corpo médio, elegante', '25-50 convidados', 19.90, '[30,50]', '', 0, 1),
  ('red-ale', 'Red Ale', 'Ale', 'Avermelhado complexo com maltes caramelizados. Equilíbrio perfeito entre doçura e amargor.', 'Cobre avermelhado, caramelo, toffee', '10-25 convidados', 23.90, '[30,50]', '', 0, 1),
  ('porter-robusto', 'Porter Robusto', 'Porter', 'Encorpado e escuro, notas de café, chocolate e maltes torrados. Para paladares refinados.', 'Marrom escuro, cremoso, intenso', '8-15 convidados', 26.90, '[30,50]', '', 0, 1),
  ('session-ipa', 'Session IPA', 'IPA', 'Versão leve da IPA, com todo o aroma de lúpulo mas menor teor alcoólico. Perfeito para longas sessões.', 'Dourado claro, cítrico, leve', '20-35 convidados', 22.90, '[30,50]', '', 0, 1),
  ('belgian-blonde', 'Belgian Blonde', 'Belgian', 'Estilo belga autêntico, frutado e especiado com fermento trapista. Complexo e sedutor.', 'Dourado pálido, ésteres frutados, picante', '12-20 convidados', 27.90, '[30,50]', '', 0, 1);