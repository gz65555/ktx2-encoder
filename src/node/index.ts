import { IEncodeOptions } from "../type.js";
import { nodeEncoder } from "./NodeBasisEncoder.js";

export { NodeBasisEncoder } from "./NodeBasisEncoder.js";

export function encodeToKTX2(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}): Promise<Uint8Array> {
  // HDR inputs (.hdr/.exr) are handed to the encoder as raw bytes and do not go
  // through an imageDecoder; only LDR inputs need one in Node.js.
  if (!options.isHDR && !options.imageDecoder) {
    throw new Error("imageDecoder is required in Node.js for non-HDR images.");
  }
  globalThis.__KTX2_DEBUG__ = options.enableDebug ?? false;
  return nodeEncoder.encode(imageBuffer, options);
}
