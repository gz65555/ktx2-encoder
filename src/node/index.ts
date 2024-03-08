import { IEncodeOptions } from "../type";
import { nodeEncoder } from "./NodeBasisEncoder";

export function encodeToKTX2(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}): Promise<Uint8Array> {
  if (!options.imageDecoder) {
    throw "imageDecoder is required in Node.js.";
  }
  return nodeEncoder.encode(imageBuffer, options);
}
