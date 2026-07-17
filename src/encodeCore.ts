import { read, write } from "ktx-parse";
import { applyInputOptions } from "./applyInputOptions.js";
import { BasisTextureType, HDRSourceType, SourceType } from "./enum.js";
import { CubeBufferData, IBasisModule, IEncodeOptions } from "./type.js";

export async function encodeWithModule(
  module: IBasisModule,
  bufferOrBufferArray: Uint8Array | CubeBufferData,
  options: Partial<IEncodeOptions> = {}
): Promise<Uint8Array> {
  const encoder = new module.BasisEncoder();
  try {
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
        if (!options.imageDecoder) throw new Error("imageDecoder is required for non-HDR images");
        const imageData = await options.imageDecoder(buffer);
        encoder.setSliceSourceImage(
          i,
          new Uint8Array(imageData.data),
          imageData.width,
          imageData.height,
          SourceType.RAW
        );
      }
    }

    const output = new Uint8Array(1024 * 1024 * (options.isHDR ? 24 : 10));
    const byteLength = encoder.encode(output);
    if (byteLength === 0) throw new Error("Encode failed");

    let result: Uint8Array = output.slice(0, byteLength);
    if (options.kvData) {
      const container = read(result);
      for (const key in options.kvData) {
        container.keyValue[key] = options.kvData[key];
      }
      result = write(container, { keepWriter: true });
    }
    return result;
  } finally {
    // Free the WASM-allocated encoder. Without this, every encode call leaks
    // the encoder struct in the WASM heap, eventually exhausting it and
    // causing `new BasisEncoder()` itself to throw "Out of bounds memory access"
    // after ~65 calls in long-running processes (batch tools, workers).
    encoder.delete();
  }
}
