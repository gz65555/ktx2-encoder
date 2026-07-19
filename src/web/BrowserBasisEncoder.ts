import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";
import BASIS from "../basis/basis_encoder.js";

const DEFAULT_WASM_URL = new URL("../basis/basis_encoder.wasm", import.meta.url).href;

/**
 * Fetches the WASM binary from the given URL. There is no CDN or other fallback:
 * only the version-matched, bundled asset is used by default, and an explicit
 * `wasmUrl` is fetched as-is. A failed request throws with the URL and status so
 * a stale or mismatched WASM never loads silently.
 */
export async function fetchWasmBinary(wasmUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(wasmUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch basis_encoder.wasm from ${wasmUrl}: ${response.status}`);
  }
  return response.arrayBuffer();
}

export class BrowserBasisEncoder {
  private modulePromise: Promise<IBasisModule> | null = null;
  private loadedWasmUrl: string | null = null;

  init(options?: { jsUrl?: string; wasmUrl?: string }): Promise<IBasisModule> {
    if (options?.jsUrl) {
      console.warn("The jsUrl option is deprecated and ignored. The bundled Basis encoder module is always used.");
    }
    const requestedWasmUrl = options?.wasmUrl ?? DEFAULT_WASM_URL;
    if (this.modulePromise && requestedWasmUrl !== this.loadedWasmUrl) {
      console.warn(
        `[ktx2-encoder] init() is already using ${this.loadedWasmUrl}; ignoring different wasmUrl ${requestedWasmUrl}. ` +
          "Create a new BrowserBasisEncoder instance to use another URL."
      );
    }
    if (!this.modulePromise) {
      async function initModule(): Promise<IBasisModule> {
        const wasmBinary = await fetchWasmBinary(requestedWasmUrl);
        const module: IBasisModule = await BASIS({ wasmBinary });
        module.initializeBasis();
        return module;
      }
      this.loadedWasmUrl = requestedWasmUrl;
      const modulePromise = initModule().catch((error) => {
        if (this.modulePromise === modulePromise) {
          this.modulePromise = null;
          this.loadedWasmUrl = null;
        }
        throw error;
      });
      this.modulePromise = modulePromise;
    }
    return this.modulePromise;
  }

  /**
   * encode image data to ktx2 file data
   * @param bufferOrBufferArray - image data, can be a single image or an array of images
   * if it's an array, the images will be encoded as a cube map, the order of the images is:
   *  0: Positive X face
   *  1: Negative X face
   *  2: Positive Y face
   *  3: Negative Y face
   *  4: Positive Z face
   *  5: Negative Z face
   * @param options - encode options, see {@link IEncodeOptions}
   * @returns ktx2 file data
   */
  async encode(
    bufferOrBufferArray: Uint8Array | CubeBufferData,
    options: Partial<IEncodeOptions> = {}
  ): Promise<Uint8Array> {
    return encodeWithModule(await this.init(options), bufferOrBufferArray, options);
  }
}

export const browserEncoder = new BrowserBasisEncoder();
