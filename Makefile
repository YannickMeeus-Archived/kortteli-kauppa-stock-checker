clean:
	@cd ./frontend && yarn clean
	@cd ./backend && cargo clean

up:
	@docker compose up -d

down:
	@docker compose down

init:
	@cd ./frontend && yarn install
	@cd ./backend && ./bin/bundle install

dev: init up
	npx stmux -M [ "yarn --cwd frontend start" .. "cd ./backend && rails s" ]

deploy-frontend:
	@cd ./frontend && yarn deploy

deploy-backend:
	@cd ./backend && flyctl deploy

build-backend:
	@cd ./backend && cargo build --manifest-path ./backend/Cargo.toml
	
build-backend-docker:
	@cd ./backend && docker build .

deploy: deploy-frontend deploy-backend

browse:
	@open https://korttelikauppastockchecker.sillygoose.io/

portal:
	@flyctl dashboard