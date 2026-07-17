import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";
import BASIS from "../basis/basis_encoder.js";

let promise: Promise<IBasisModule> | null = null;

const DEFAULT_WASM_URL = new URL("../basis/basis_encoder.wasm", import.meta.url).href;

class BrowserBasisEncoder {
  async init(options?: { jsUrl?: string; wasmUrl?: string }) {
    if (options?.jsUrl) {
      console.warn("The jsUrl option is deprecated and ignored. The bundled Basis encoder module is always used.");
    }
    if (!promise) {
      async function initModule(): Promise<IBasisModule> {
        const wasmUrl = options?.wasmUrl ?? DEFAULT_WASM_URL;
        const response = await fetch(wasmUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch basis_encoder.wasm from ${wasmUrl}: ${response.status}`);
        }
        const module: IBasisModule = await BASIS({ wasmBinary: await response.arrayBuffer() });
        module.initializeBasis();
        return module;
      }
      promise = initModule();
    }
    return promise;
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
