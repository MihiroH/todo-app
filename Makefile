APP_DIR = ./frontend
SAIL = ./vendor/bin/sail

init:
	composer install && $(SAIL) up -d && cd $(APP_DIR) && npm install

migrate-init:
	$(SAIL) artisan migrate; $(SAIL) artisan migrate --env=testing

serve-app:
	cd $(APP_DIR) && npm run serve

build-app:
	cd $(APP_DIR) && npm run build

lint-app:
	cd $(APP_DIR) && npm run lint

serve-api:
	$(SAIL) up -d

stop-api:
	$(SAIL) stop

down-api:
	$(SAIL) down

test-api:
	$(SAIL) artisan test

migrate-up:
	$(SAIL) artisan migrate

db-seed:
	$(SAIL) artisan db:seed

.PHONY: init migrate-init serve-app build-app lint-app serve-api stop-api down-api test-api migrateup db-seed
