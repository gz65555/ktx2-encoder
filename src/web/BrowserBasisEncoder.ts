import { read, write } from "ktx-parse";
import { IBasisModule, IEncodeOptions } from "../type.js";
import { applyInputOptions } from "../utils.js";
import { BasisTextureType, HDRSourceType, SourceType } from "../enum.js";

let promise: Promise<IBasisModule> | null = null;

const DEFAULT_WASM_URL =
  "https://mdn.alipayobjects.com/rms/afts/file/A*r7D4SKbksYcAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm";

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

  async encode(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}) {
    const basisModule = await this.init(options);
    const encoder = new basisModule.BasisEncoder();
    applyInputOptions(options, encoder);
    encoder.setTexType(BasisTextureType.cBASISTexType2D);
    if (options.isHDR) {
      encoder.setUASTCHDRQualityLevel(options.hdrQualityLevel);
      encoder.setSliceSourceImageHDR(
        0,
        imageBuffer,
        0,
        0,
        options.imageType === "hdr" ? HDRSourceType.HDR : HDRSourceType.EXR,
        true
      );
    } else {
      const imageData = await options.imageDecoder!(imageBuffer);
      encoder.setSliceSourceImage(0, new Uint8Array(imageData.data), imageData.width, imageData.height, SourceType.RAW);
    }

    const ktx2FileData = new Uint8Array(1024 * 1024 * (options.isHDR ? 24 : 10));
    const byteLength = encoder.encode(ktx2FileData);
    if (byteLength === 0) {
      throw "encode failed";
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
