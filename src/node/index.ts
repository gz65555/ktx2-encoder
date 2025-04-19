import { IEncodeOptions } from "../type.js";
import { nodeEncoder } from "./NodeBasisEncoder.js";

export function encodeToKTX2(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}): Promise<Uint8Array> {
  if (!options.imageDecoder) {
    throw "imageDecoder is required in Node.js.";
  }
  globalThis.DEBUG = options.enableDebug ?? false;
  return nodeEncoder.encode(imageBuffer, options);
}
