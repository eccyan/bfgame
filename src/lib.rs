use wasm_bindgen::prelude::*;

use std::collections::HashMap;

mod video;
use video::Buffer;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct BfInterpreter {
    memory: Vec<u8>,
    memory_pointer: usize,
    source_pointer: usize,
    output_pointer: usize,
    labels: HashMap<String, usize>,
    buffer: Buffer,
}

#[wasm_bindgen]
impl BfInterpreter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let memory = vec![0; 256 * 240 * 4];
        let memory_pointer = 0;
        let source_pointer = 0;
        let output_pointer = 0;
        let labels = HashMap::new();
        let buffer = Buffer::new();

        BfInterpreter {
            memory,
            memory_pointer,
            source_pointer,
            output_pointer,
            labels,
            buffer,
        }
    }

    pub fn copy_front_buffer(&self) -> Vec<u8> {
        self.buffer.get_front_buffer().clone()
    }

    pub fn update(&mut self) {
        self.buffer.transfer();
    }

    pub fn execute(&mut self, source: &str) {
        log(&format!("bf: {}", source));
        let source_chars = source.chars().collect::<Vec<_>>();
        self.source_pointer = 0;

        while self.source_pointer < source_chars.len() {
            let c = source_chars[self.source_pointer];

            match c {
                '>' => self.memory_pointer += 1,
                '<' => self.memory_pointer -= 1,
                '+' => self.memory[self.memory_pointer] += 1,
                '-' => self.memory[self.memory_pointer] -= 1,
                '.' => {
                    let back_buffer_ptr = self.buffer.get_back_buffer_ptr();
                    unsafe {
                        *back_buffer_ptr.add(self.output_pointer) = self.memory[self.memory_pointer];
                    }
                    self.output_pointer = (self.output_pointer + 1) % (256 * 240 * 4);
                }
                ',' => {
                }
                '[' => {
                    log("loop in");
                }
                ']' => {
                    log("loop out");
                    if self.memory[self.memory_pointer] != 0 {
                        let mut loop_count = 1;
                        let mut prev_idx = self.source_pointer;
                        while loop_count > 0 {
                            prev_idx -= 1;
                            let prev_c = Some(source_chars[prev_idx]);
                            if let Some(prev_c) = prev_c{
                                if prev_c == ']' {
                                    loop_count += 1;
                                } else if prev_c == '[' {
                                    loop_count -= 1;
                                }
                                self.source_pointer = prev_idx;
                            } else {
                                break;
                            }
                        }
                    }
                }
                '!' => {
                    let sliced = source_chars.get(self.source_pointer..);
                    if let Some(sliced) = sliced {
                        let label = sliced
                            .iter()
                            .enumerate()
                            .take_while(|(_, &c)| c != '\n')
                            .map(|(_, &c)| c)
                            .collect::<String>();
                        self.labels.insert(label.clone(), self.source_pointer);
                    }
                }
                _ => {}
            }

            match c {
                '>'|'<'|'+'|'-'|'.'|','|'['|']' => {
                    log(&format!("src: {}, mem: {}, out: {}, sval: {}, mval: {}",
                            self.source_pointer, self.memory_pointer, self.output_pointer, c, self.memory[self.memory_pointer]));
                }
                _ => {}
            }

            self.source_pointer += 1;
        }
        log(&format!("buf: \n{:?}", self.memory));
        log(&format!("buf: \n{:?}", self.buffer.get_back_buffer()));
    }
}
