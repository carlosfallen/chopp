# FILE: Makefile
.PHONY: help build dev prod stop clean logs shell db-init

help: ## Mostrar ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build da imagem Docker
	docker-compose build

dev: ## Iniciar em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml up -d
	@echo "🚀 Aplicação rodando em http://localhost:4321"
	@echo "📊 Admin em http://localhost:4321/admin"

prod: ## Iniciar em modo produção
	docker-compose -f docker-compose.prod.yml up -d
	@echo "🚀 Aplicação rodando em http://localhost"

stop: ## Parar containers
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.prod.yml down

clean: ## Limpar containers e volumes
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

logs: ## Ver logs
	docker-compose -f docker-compose.dev.yml logs -f

shell: ## Abrir shell no container
	docker exec -it chopp-dev sh

db-init: ## Inicializar banco de dados
	docker exec -it chopp-dev wrangler d1 execute chopp_db --local --file=schema.sql

db-reset: ## Resetar banco de dados
	docker exec -it chopp-dev rm -f .wrangler/state/v3/d1/miniflare-D1DatabaseObject/chopp_db.sqlite
	docker exec -it chopp-dev wrangler d1 execute chopp_db --local --file=schema.sql
	@echo "✅ Banco de dados resetado"

restart: stop dev ## Reiniciar aplicação

ps: ## Ver status dos containers
	docker-compose ps