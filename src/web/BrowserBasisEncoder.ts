import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";

let promise: Promise<IBasisModule> | null = null;

const DEFAULT_WASM_URL =
  "https://mdn.alipayobjects.com/rms/afts/file/A*r7D4SKbksYcAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm";

class BrowserBasisEncoder {
  async init(options?: { jsUrl?: string; wasmUrl?: string }) {
    if (!promise) {
      function initModule(): Promise<IBasisModule> {
        const wasmUrl = options?.wasmUrl ?? DEFAULT_WASM_URL;
        const jsUrl = options?.jsUrl ?? "../basis/basis_encoder.js";
        return new Promise((resolve, reject) => {
          Promise.all([
            import(/* @vite-ignore */ jsUrl),
            wasmUrl ? fetch(wasmUrl).then((res) => res.arrayBuffer()) : undefined
          ])
            .then(([{ default: BASIS }, wasmBinary]) => {
              return BASIS({ wasmBinary }).then((Module: IBasisModule) => {
                Module.initializeBasis();
                resolve(Module);
              });
            })
            .catch(reject);
        });
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
