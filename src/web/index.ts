import { CubeBufferData, IEncodeOptions } from "../type.js";
import { browserEncoder } from "./BrowserBasisEncoder.js";
import { decodeImageBitmap } from "./decodeImageData.js";

export * from "../enum.js";
export * from "../type.js";
export { BrowserBasisEncoder } from "./BrowserBasisEncoder.js";

export function encodeToKTX2(
  imageBuffer: Uint8Array | CubeBufferData,
  options: Partial<IEncodeOptions> = {}
): Promise<Uint8Array> {
  options.imageDecoder ??= decodeImageBitmap;
  globalThis.__KTX2_DEBUG__ = options.enableDebug ?? false;
  return browserEncoder.encode(imageBuffer, options);
}
