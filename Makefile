clean:
	@cd ./frontend && yarn clean
	@cd ./backend && cargo clean

up:
	@docker compose up -d

down:
	@docker compose down -v

init:
	@cd ./frontend && yarn install
	@cd ./backend && cargo update

dev: init up
	npx stmux -M [ "yarn --cwd frontend start" .. "cargo watch -x run --workdir ./backend/" ]

deploy-frontend:
	@cd ./frontend && yarn deploy

build-backend:
	@cd ./backend && cargo build --manifest-path ./backend/Cargo.toml
	
build-backend-docker:
	@cd ./backend && docker build .

deploy: deploy-frontend deploy-backend

browse:
	@open https://korttelikauppastockchecker.sillygoose.io/

portal:
	@flyctl dashboard