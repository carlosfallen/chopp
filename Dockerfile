# FILE: Dockerfile
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY astro.config.mjs ./

RUN npm install -g wrangler

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p .wrangler/state/v3/d1/miniflare-D1DatabaseObject
RUN touch .wrangler/state/v3/d1/miniflare-D1DatabaseObject/1c6da776-060b-4cda-82d4-0d34c0641c42.sqlite

COPY schema.sql ./
RUN npx wrangler d1 execute chopp_delivery_db --local --file=schema.sql || echo "DB already initialized"

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache sqlite

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.wrangler ./.wrangler
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/wrangler.toml ./
COPY --from=builder /app/schema.sql ./

RUN npm install -g wrangler

EXPOSE 4321
EXPOSE 8787

ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["npm", "run", "dev", "--host", "0.0.0.0"]