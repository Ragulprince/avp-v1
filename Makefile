
.PHONY: setup run-all run-web run-backend stop-all clean-all install-all

# Setup - Create shared network and install dependencies
setup:
	docker network create avp-network 2>/dev/null || true
	cd web && make install
	cd backend && make install

# Run both web and backend
run-all:
	docker network create avp-network 2>/dev/null || true
	cd backend && make run-detached
	sleep 10
	cd web && make run

# Run only web
run-web:
	docker network create avp-network 2>/dev/null || true
	cd web && make run

# Run only backend (with postgres, redis, adminer)
run-backend:
	docker network create avp-network 2>/dev/null || true
	cd backend && make run

# Stop all services
stop-all:
	cd web && make stop
	cd backend && make stop

# Clean all
clean-all:
	cd web && make clean
	cd backend && make clean
	docker network rm avp-network 2>/dev/null || true

# Install dependencies for both
install-all:
	cd web && make install
	cd backend && make install

# View logs
logs-web:
	cd web && make logs

logs-backend:
	cd backend && make logs

