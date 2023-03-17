# bfgame

Creates games using the Brainfxxk, based on using Rust, wasm-bindgen, and WebAssembly.

Sorry! the project can only display images with WebAssembly's own extended BF parser at the moment.

Demo: https://main.d32dg7qoqgsldu.amplifyapp.com/

## Prerequisites

- Rust (latest stable version recommended)
- [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen)

## Setup

### Install wasm32-unknown-unknown target

Before building the project, make sure to install the `wasm32-unknown-unknown` target for Rust. You can install it using the following command:

```
rustup target add wasm32-unknown-unknown
```

This command installs the necessary target to compile Rust code to WebAssembly.

### Install wasm-bindgen CLI

You'll also need to install the wasm-bindgen CLI. You can do this by running:

```
cargo install wasm-bindgen-cli
```

## Build

To build the project, run the following command:

```
make
```

This command will compile the Rust code to WebAssembly and generate the necessary JavaScript bindings.

## Run

To run the project, open `index.html` in your web browser. You should see the output of the WebAssembly module on the screen.

## License

This project is licensed under the [MIT License](LICENSE).
