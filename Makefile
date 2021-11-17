clean:
	@cd ./frontend && yarn clean
	@cd ./backend && yarn clean

up:
	@docker compose up -d

down:
	@docker compose down

init:
	@cd ./frontend && yarn install
	@cd ./backend && yarn install

dev: init up
	npx stmux -M [ "yarn --cwd frontend start" .. "yarn --cwd backend dev" ]

deploy-frontend:
	@cd ./frontend && yarn deploy

deploy-backend:
	@cd ./backend && flyctl deploy

build-backend:
	@cd ./backend && yarn build
	
build-backend-docker:
	@cd ./backend && docker build .

deploy: deploy-frontend deploy-backend

browse:
	@open https://korttelikauppastockchecker.sillygoose.io/

portal:
	@flyctl dashboard