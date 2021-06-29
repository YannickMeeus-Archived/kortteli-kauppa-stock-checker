# Build/Packaging
frontend/node_modules: frontend/package.json
	@yarn --cwd frontend install

backend/target: backend/Cargo.toml
	@cargo build --manifest-path ./backend/Cargo.toml

.PHONY: init
init: frontend/node_modules backend/target

.PHONY: clean
clean:
	@rm -rf ./frontend/build ./frontend/node_modules
	@rm -rf ./backend/target

# Operational Commands
up:
	@docker compose up -d

down:
	@docker compose down -v

dev: init up
	yarn stmux -M [ "yarn --cwd frontend start" .. "cargo run ----manifest-path ./backend/Cargo.toml" ]

start: up
	@yarn start

deploy:
	@flyctl deploy

browse:
	@open https://kk-stock.sillygoose.io

portal:
	@flyctl dashboard