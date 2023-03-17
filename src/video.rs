use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Buffer {
    front_buffer: Vec<u8>,
    back_buffer: Vec<u8>,
}

#[wasm_bindgen]
impl Buffer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let front_buffer = vec![0; 256 * 240 * 4];
        let back_buffer = vec![0; 256 * 240 * 4];

        Buffer {
            front_buffer,
            back_buffer,
        }
    }

    pub fn get_front_buffer(&self) -> Vec<u8> {
        self.front_buffer.clone()
    }

    pub fn get_front_buffer_ptr(&self) -> *const u8 {
        self.front_buffer.as_ptr()
    }

    pub fn get_back_buffer_ptr(&mut self) -> *mut u8 {
        self.back_buffer.as_mut_ptr()
    }

    pub fn transfer(&mut self) {
        self.front_buffer.copy_from_slice(&self.back_buffer);
    }
}
