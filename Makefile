VERSION:=$(shell git rev-parse --short HEAD)


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

test: init up
	yarn --cwd frontend test  --watchAll=false --passWithNoTests
	yarn --cwd backend test

deploy-frontend:
	@cd ./frontend && yarn deploy
	
deploy-backend:
	@cd ./backend && flyctl deploy --build-arg VERSION=$(VERSION)

lint-backend:
	yarn --cwd backend lint

build-frontend:
	yarn --cwd frontend build

build-backend:
	yarn --cwd backend build
	
build-backend-docker:
	@cd ./backend && docker build .

ci: init up test lint-backend build-backend build-frontend

deploy: deploy-frontend deploy-backend browse
	

browse:
	@open https://korttelikauppastockchecker.sillygoose.io/

backfill:
	yarn --cwd backend backfill

portal:
	@flyctl dashboard