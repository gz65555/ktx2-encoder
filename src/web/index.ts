import { IEncodeOptions } from "../type.js";
import { browserEncoder } from "./BrowserBasisEncoder.js";
import { decodeImageBitmap } from "./decodeImageData.js";

/** @ignore */
export function encodeToKTX2(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}): Promise<Uint8Array> {
  options.imageDecoder ??= decodeImageBitmap;
  return browserEncoder.encode(imageBuffer, options);
}
