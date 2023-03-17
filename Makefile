.PHONY: all build clean serve

PROJECT = "bfgame"

all: install build

install: ;@echo "Installing ${PROJECT}.....";
	@npm install

build: ;@echo "Building ${PROJECT}.....";
	@cargo build --target wasm32-unknown-unknown --release
	@wasm-bindgen target/wasm32-unknown-unknown/release/bfgame.wasm --out-dir ./web/pkg --web

update: ;@echo "Updating ${PROJECT}.....";
	@git pull --rebase; \
	@npm install

clean: ;@echo "Cleaning ${PROJECT}.....";
	@cargo clean
	@rm -rf ./src/pkg
	@rm -rf node_modules

serve: ;@echo "Starting ${PROJECT}'s local development server...";
	@npm run serve
