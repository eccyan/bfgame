/* tslint:disable */
/* eslint-disable */
/**
*/
export class BfInterpreter {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Uint8Array}
*/
  copy_front_buffer(): Uint8Array;
/**
*/
  update(): void;
/**
* @param {string} source
*/
  execute(source: string): void;
}
/**
*/
export class Buffer {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Uint8Array}
*/
  get_front_buffer(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  get_back_buffer(): Uint8Array;
/**
* @returns {number}
*/
  get_front_buffer_ptr(): number;
/**
* @returns {number}
*/
  get_back_buffer_ptr(): number;
/**
*/
  transfer(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_bfinterpreter_free: (a: number) => void;
  readonly bfinterpreter_new: () => number;
  readonly bfinterpreter_copy_front_buffer: (a: number, b: number) => void;
  readonly bfinterpreter_update: (a: number) => void;
  readonly bfinterpreter_execute: (a: number, b: number, c: number) => void;
  readonly __wbg_buffer_free: (a: number) => void;
  readonly buffer_new: () => number;
  readonly buffer_get_front_buffer: (a: number, b: number) => void;
  readonly buffer_get_back_buffer: (a: number, b: number) => void;
  readonly buffer_get_front_buffer_ptr: (a: number) => number;
  readonly buffer_get_back_buffer_ptr: (a: number) => number;
  readonly buffer_transfer: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
