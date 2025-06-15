
.PHONY: install run build stop clean logs

# Install dependencies
install:
	npm install

# Run development server
run:
	docker-compose up --build

# Run in detached mode
run-detached:
	docker-compose up -d --build

# Build for production
build:
	npm run build

# Stop services
stop:
	docker-compose down

# Clean up containers and volumes
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# View logs
logs:
	docker-compose logs -f

# Shell into container
shell:
	docker-compose exec web sh

