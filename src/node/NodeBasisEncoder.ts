import { SourceType } from "../enum.js";
import { IBasisModule, IEncodeOptions } from "../type.js";
import { applyInputOptions } from "../utils.js";
import BASIS from "./basis/basis_encoder.cjs";

let promise: Promise<IBasisModule> | null = null;

class NodeBasisEncoder {
  async init(): Promise<IBasisModule> {
    if (!promise) {
      promise = BASIS().then((basis: IBasisModule) => {
        basis.initializeBasis();
        return basis;
      });
    }
    return promise as Promise<IBasisModule>;
  }

  async encode(imageBitmapSource: Uint8Array, options: Partial<IEncodeOptions> = {}) {
    const imageData = await options.imageDecoder!(imageBitmapSource);
    const basis = await this.init();
    const basisEncoder = new basis.BasisEncoder();

    const w = imageData.width;
    const h = imageData.height;
    const rgbaPixels = imageData.data;

    basisEncoder.setSliceSourceImage(0, new Uint8Array(rgbaPixels), w, h, SourceType.RAW);

    applyInputOptions(options, basisEncoder);

    const resultData = new Uint8Array(w * h * 4 * 2);
    const resultSize = basisEncoder.encode(resultData);
    if (resultSize === 0) {
      throw "Something wrong";
    }

    return Buffer.from(resultData.subarray(0, resultSize));
  }
}

export const nodeEncoder = new NodeBasisEncoder();
