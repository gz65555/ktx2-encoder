import { HDRSourceType, SourceType } from "../enum.js";
import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { applyInputOptions } from "../applyInputOptions.js";
import BASIS from "../basis/basis_encoder.js";

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

  async encode(bufferOrBufferArray: Uint8Array | CubeBufferData, options: Partial<IEncodeOptions> = {}) {
    const basis = await this.init();
    const encoder = new basis.BasisEncoder();

    const bufferArray = Array.isArray(bufferOrBufferArray) ? bufferOrBufferArray : [bufferOrBufferArray];
    applyInputOptions(options, encoder);

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

    const resultData = new Uint8Array(1024 * 1024 * (options.isHDR ? 24 : 10));
    const resultSize = encoder.encode(resultData);
    if (resultSize === 0) {
      throw new Error("Encode failed");
    }
    return Buffer.from(resultData.subarray(0, resultSize));
  }
}

export const nodeEncoder = new NodeBasisEncoder();
