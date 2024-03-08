import { IEncodeOptions } from "../type";
import { browserEncoder } from "./BrowserBasisEncoder";
import { decodeImageBitmap } from "./decodeImageData";

export function encodeToKTX2(imageBuffer: Uint8Array, options: Partial<IEncodeOptions> = {}): Promise<Uint8Array> {
  options.imageDecoder ??= decodeImageBitmap;
  return browserEncoder.encode(imageBuffer, options);
}
