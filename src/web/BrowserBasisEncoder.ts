import { read, write } from "ktx-parse";
import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { applyInputOptions } from "../applyInputOptions.js";
import { BasisTextureType, HDRSourceType, SourceType } from "../enum.js";

let promise: Promise<IBasisModule> | null = null;

const DEFAULT_WASM_URL = "/ktx2-encoder/basis/basis_encoder.wasm";

class BrowserBasisEncoder {
  async init(options?: { jsUrl?: string; wasmUrl?: string }) {
    if (!promise) {
      function _init(): Promise<IBasisModule> {
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
      promise = _init();
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
    const basisModule = await this.init(options);
    const encoder = new basisModule.BasisEncoder();
    applyInputOptions(options, encoder);
    const isCube = Array.isArray(bufferOrBufferArray) && bufferOrBufferArray.length === 6;
    encoder.setTexType(isCube ? BasisTextureType.cBASISTexTypeCubemapArray : BasisTextureType.cBASISTexType2D);

    const bufferArray = Array.isArray(bufferOrBufferArray) ? bufferOrBufferArray : [bufferOrBufferArray];

    for (let i = 0; i < bufferArray.length; i++) {
      const buffer = bufferArray[i];
      if (options.isHDR) {
        encoder.setSliceSourceImageHDR(
          i,
          buffer,
          0,
          0,
          options.imageType === "hdr" ? HDRSourceType.HDR : HDRSourceType.EXR,
          true
        );
      } else {
        const imageData = await options.imageDecoder!(buffer);
        encoder.setSliceSourceImage(
          i,
          new Uint8Array(imageData.data),
          imageData.width,
          imageData.height,
          SourceType.RAW
        );
      }
    }

    const ktx2FileData = new Uint8Array(1024 * 1024 * (options.isHDR ? 24 : 10));
    const byteLength = encoder.encode(ktx2FileData);
    if (byteLength === 0) {
      throw new Error("Encode failed");
    }
    let actualKTX2FileData = new Uint8Array(ktx2FileData.buffer, 0, byteLength);
    if (options.kvData) {
      const container = read(ktx2FileData);
      for (let k in options.kvData) {
        container.keyValue[k] = options.kvData[k];
      }
      actualKTX2FileData = write(container, { keepWriter: true });
    }
    return actualKTX2FileData;
  }
}

export const browserEncoder = new BrowserBasisEncoder();
