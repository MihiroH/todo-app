APP_DIR = ./frontend

serve-app:
	cd $(APP_DIR) && npm run serve

build-app:
	cd $(APP_DIR) && npm run build

lint-app:
	cd $(APP_DIR) && npm run lint

.PHONY: serve build lint