# FILE: docker-entrypoint.sh
#!/bin/sh
set -e

echo "🚀 Iniciando aplicação..."

# Verificar se o banco de dados existe
if [ ! -f ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/chopp_db.sqlite" ]; then
    echo "📦 Inicializando banco de dados..."
    mkdir -p .wrangler/state/v3/d1/miniflare-D1DatabaseObject
    touch .wrangler/state/v3/d1/miniflare-D1DatabaseObject/chopp_db.sqlite
    wrangler d1 execute chopp_db --local --file=schema.sql
    echo "✅ Banco de dados inicializado"
else
    echo "✅ Banco de dados já existe"
fi

# Executar comando
exec "$@"