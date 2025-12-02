# FILE: Dockerfile
FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat git

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY astro.config.mjs ./

# Instalar Wrangler globalmente
RUN npm install -g wrangler

# Stage de dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Criar banco de dados SQLite local
RUN mkdir -p .wrangler/state/v3/d1
RUN touch .wrangler/state/v3/d1/miniflare-D1DatabaseObject/chopp_db.sqlite

# Inicializar banco de dados
COPY schema.sql ./
RUN npx wrangler d1 execute chopp_db --local --file=schema.sql || echo "DB already initialized"

# Build do projeto
RUN npm run build

# Stage de produção
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache sqlite

# Copiar arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.wrangler ./.wrangler
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/wrangler.toml ./
COPY --from=builder /app/schema.sql ./

# Instalar Wrangler
RUN npm install -g wrangler

# Expor porta
EXPOSE 4321
EXPOSE 8787

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "preview"]