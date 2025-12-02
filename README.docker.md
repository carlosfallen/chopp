# FILE: README.docker.md
# Docker Setup - Chopp Delivery

## Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+
- Make (opcional, mas recomendado)

## Comandos Rápidos

### Desenvolvimento
```bash
# Iniciar aplicação em modo desenvolvimento
make dev

# Ou sem Make
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
make logs

# Parar
make stop
```

### Produção
```bash
# Build e iniciar
make prod

# Ou sem Make
docker-compose -f docker-compose.prod.yml up -d
```

### Banco de Dados
```bash
# Inicializar banco
make db-init

# Resetar banco
make db-reset

# Acessar shell do container
make shell
```

## Estrutura
```
.
├── Dockerfile              # Build de produção
├── Dockerfile.dev          # Build de desenvolvimento
├── Dockerfile.prod         # Build otimizado para produção
├── docker-compose.yml      # Compose principal
├── docker-compose.dev.yml  # Compose para desenvolvimento
├── docker-compose.prod.yml # Compose para produção
├── docker-entrypoint.sh    # Script de inicialização
├── nginx.conf              # Configuração do Nginx
└── Makefile                # Comandos facilitados
```

## Portas

- **4321**: Aplicação Astro
- **8787**: Wrangler (desenvolvimento)
- **80**: Nginx (produção)
- **443**: Nginx SSL (produção)

## Volumes

- `.wrangler/`: Dados do Wrangler e banco D1
- `uploads/`: Uploads de arquivos
- `src/`: Código fonte (hot reload em dev)

## Variáveis de Ambiente

Crie um arquivo `.env`:
```env
NODE_ENV=development
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=chopp-images
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

## Troubleshooting

### Banco de dados não inicializa
```bash
make db-reset
```

### Porta já em uso
```bash
# Mudar porta no docker-compose.yml
ports:
  - "3000:4321"  # Usar porta 3000 no host
```

### Limpar tudo e recomeçar
```bash
make clean
make dev
```

## Desenvolvimento

O hot reload está ativado por padrão. Mudanças em `src/` serão refletidas automaticamente.

## Produção

Para deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `make prod`
3. Configure SSL no Nginx (certificados em `./ssl/`)
4. Acesse via domínio configurado

## Comandos Úteis
```bash
# Ver todos os comandos disponíveis
make help

# Ver status dos containers
make ps

# Reiniciar aplicação
make restart

# Ver logs específicos
docker-compose logs app

# Executar comando no container
docker exec -it chopp-dev npm run build
```