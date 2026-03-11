/* tslint:disable */
/* eslint-disable */
/**
 * The main Emulator struct exposed to JavaScript.
 */
export class Emulator {
  free(): void;
  /**
   * Creates a new Emulator instance with the ROM bytes provided by JavaScript.
   */
  constructor(rom_data: Uint8Array);
  /**
   * Executes enough CPU and GPU cycles to produce one frame.
   * Call this from a requestAnimationFrame loop in JavaScript.
   */
  tick(): void;
  /**
   * Drains and returns accumulated stereo audio samples as f32 in [-1, 1].
   * Interleaved: [L0, R0, L1, R1, ...]. Call this once per frame after tick().
   */
  get_audio_samples(): Float32Array;
  /**
   * Returns the current frame as an RGBA byte vector (160×144×4 bytes).
   */
  get_framebuffer(): Uint8Array;
  /**
   * Returns the instruction log as a newline-separated string (most-recent first).
   */
  get_instruction_log(): string;
  /**
   * Returns the VRAM tileset as an RGBA byte vector (128×192 px, 384 tiles).
   */
  get_tileset(): Uint8Array;
  /**
   * Returns the full 64KB memory map as an RGBA byte vector (256×256 px).
   */
  get_memory_map(): Uint8Array;
  /**
   * Called by JavaScript on keydown. key_code is the browser KeyboardEvent.code value.
   */
  key_down(key_code: string): void;
  /**
   * Called by JavaScript on keyup.
   */
  key_up(key_code: string): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_emulator_free: (a: number, b: number) => void;
  readonly emulator_new: (a: number, b: number) => number;
  readonly emulator_tick: (a: number) => void;
  readonly emulator_get_audio_samples: (a: number) => [number, number];
  readonly emulator_get_framebuffer: (a: number) => [number, number];
  readonly emulator_get_instruction_log: (a: number) => [number, number];
  readonly emulator_get_tileset: (a: number) => [number, number];
  readonly emulator_get_memory_map: (a: number) => [number, number];
  readonly emulator_key_down: (a: number, b: number, c: number) => void;
  readonly emulator_key_up: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
