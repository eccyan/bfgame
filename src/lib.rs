use wasm_bindgen::prelude::*;
use std::collections::HashMap;

mod video;
use video::Buffer;

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

    pub fn get_front_buffer_ptr(&self) -> *const u8 {
        self.buffer.get_front_buffer_ptr()
    }

    pub fn update(&mut self) {
        self.buffer.transfer();
    }

    pub fn execute(&mut self, source: &str) {
        let source_chars = source.chars().collect::<Vec<_>>();
        let mut source_iterator = source_chars.iter().enumerate();

        while let Some((idx, &c)) = source_iterator.next() {
            self.source_pointer = idx;

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
                    self.memory[self.memory_pointer] = self.memory[self.output_pointer];
                    self.output_pointer = (self.output_pointer + 1) % (256 * 240 * 4);
                }
                '[' => {
                    if self.memory[self.memory_pointer] == 0 {
                        let mut loop_count = 1;
                        while loop_count > 0 {
                            if let Some((_, &next_c)) = source_iterator.next() {
                                if next_c == '[' {
                                    loop_count += 1;
                                } else if next_c == ']' {
                                    loop_count -= 1;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
                ']' => {
                    if self.memory[self.memory_pointer] != 0 {
                        let mut loop_count = 1;
                        while loop_count > 0 {
                            if let Some((prev_idx, &prev_c)) = source_iterator.next_back() {
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
                    let label = source_iterator
                        .by_ref()
                        .take_while(|&(_, &c)| c != '\n')
                        .map(|(_, &c)| c)
                        .collect::<String>();
                    self.labels.insert(label.clone(), self.source_pointer);
                }
                _ => {}
            }
        }
    }
}
