APP_DIR = ./frontend

serve-app:
	cd $(APP_DIR) && npm run serve

build-app:
	cd $(APP_DIR) && npm run build

lint-app:
	cd $(APP_DIR) && npm run lint

serve-api:
	./vendor/bin/sail up -d

stop-api:
	./vendor/bin/sail stop

down-api:
	./vendor/bin/sail down

.PHONY: serve-app build-app lint-app serve-api stop-api down-api
