import { read, write } from "ktx-parse";
import { applyInputOptions } from "./applyInputOptions.js";
import { BasisTextureType, HDRSourceType, SourceType } from "./enum.js";
import { CubeBufferData, IBasisEncoder, IBasisModule, IEncodeOptions } from "./type.js";
import { DefaultOptions } from "./utils.js";

const OUTPUT_HEADER_SLACK = 64 * 1024;
const DEFAULT_HDR_OUTPUT_CAPACITY = 24 * 1024 * 1024;

// Basis Universal v2.5 caps total source texels to guard 32-bit WASM against OOM.
// For the formats this library produces (ETC1S / UASTC LDR 4x4 / UASTC HDR 4x4)
// the wrapper uses BASISU_ENCODER_MAX_SOURCE_IMAGE_PIXELS_HIGHER_LIMIT = 12 Mpix.
// See WASM_UPDATE_PLAN §4.2/§6.5. The legacy WASM has no such cap, so this is
// enforced ONLY when a v2.5 encoder is detected — otherwise it would reject
// large inputs the currently-bundled WASM still encodes.
const V25_MAX_SOURCE_TEXELS = 12 * 1024 * 1024;

// v2.5 default nit multiplier for LDR->HDR upconversion (WASM_UPDATE_PLAN §6.3).
// A no-op for already-HDR (.hdr/.exr) inputs, which is all we currently support.
const DEFAULT_LDR_TO_HDR_NIT_MULTIPLIER = 100;

// Detect a v2.5 wrapper by a method that only exists after the rename. Used to
// pick call shapes that differ between WASM generations during the migration.
function isV25Encoder(encoder: IBasisEncoder): boolean {
  return typeof encoder.setETC1SCompressionLevel === "function";
}

export function estimateOutputCapacity(
  slices: ReadonlyArray<{ width: number; height: number }> | null,
  inputByteLength: number,
  isHDR: boolean,
  generateMipmap: boolean
): number {
  if (!isHDR && slices) {
    const texels = slices.reduce((total, { width, height }) => total + Math.max(0, width) * Math.max(0, height), 0);
    const mipFactor = generateMipmap ? 4 / 3 : 1;
    return Math.ceil(texels * 4 * mipFactor) + OUTPUT_HEADER_SLACK;
  }

  return Math.max(Math.max(0, inputByteLength) * 8, DEFAULT_HDR_OUTPUT_CAPACITY) + OUTPUT_HEADER_SLACK;
}

export async function encodeWithModule(
  module: IBasisModule,
  bufferOrBufferArray: Uint8Array | CubeBufferData,
  options: Partial<IEncodeOptions> = {}
): Promise<Uint8Array> {
  const encoder = new module.BasisEncoder();
  try {
    applyInputOptions(options, encoder);
    const v25 = isV25Encoder(encoder);

    const isCube = Array.isArray(bufferOrBufferArray) && bufferOrBufferArray.length === 6;
    encoder.setTexType(isCube ? BasisTextureType.cBASISTexTypeCubemapArray : BasisTextureType.cBASISTexType2D);

    const bufferArray = Array.isArray(bufferOrBufferArray) ? bufferOrBufferArray : [bufferOrBufferArray];
    const inputByteLength = bufferArray.reduce((total, buffer) => total + buffer.byteLength, 0);
    const slices: Array<{ width: number; height: number }> = [];
    for (let i = 0; i < bufferArray.length; i++) {
      const buffer = bufferArray[i];
      if (options.isHDR) {
        const type = options.imageType === "hdr" ? HDRSourceType.HDR : HDRSourceType.EXR;
        // v2.5 added a 7th nit-multiplier arg; the legacy wrapper rejects it.
        const ok = v25
          ? encoder.setSliceSourceImageHDR(i, buffer, 0, 0, type, true, DEFAULT_LDR_TO_HDR_NIT_MULTIPLIER)
          : encoder.setSliceSourceImageHDR(i, buffer, 0, 0, type, true);
        if (ok === false) {
          throw new Error(`setSliceSourceImageHDR failed for slice ${i} (imageType=${options.imageType}).`);
        }
      } else {
        if (!options.imageDecoder) throw new Error("imageDecoder is required for non-HDR images");
        const imageData = await options.imageDecoder(buffer);
        slices.push({ width: imageData.width, height: imageData.height });
        const ok = encoder.setSliceSourceImage(
          i,
          new Uint8Array(imageData.data),
          imageData.width,
          imageData.height,
          SourceType.RAW
        );
        if (ok === false) {
          throw new Error(
            `setSliceSourceImage failed for slice ${i} (${imageData.width}x${imageData.height}, RAW RGBA).`
          );
        }
      }
    }

    // v2.5 source-texel ceiling: fail fast with a clear message instead of
    // letting encode() return 0 and burning a doubled-capacity retry.
    if (v25 && !options.isHDR) {
      const totalTexels = slices.reduce(
        (total, { width, height }) => total + Math.max(0, width) * Math.max(0, height),
        0
      );
      if (totalTexels > V25_MAX_SOURCE_TEXELS) {
        throw new Error(
          `Total source texels ${totalTexels} exceed the encoder limit of ${V25_MAX_SOURCE_TEXELS} ` +
            `(~12 Mpix across all ${slices.length} slice(s)). Reduce resolution or split the input; ` +
            `a single 4096x4096 image alone is over this limit.`
        );
      }
    }

    let capacity =
      options.outputBufferSize ??
      estimateOutputCapacity(
        options.isHDR ? null : slices,
        inputByteLength,
        options.isHDR ?? false,
        options.generateMipmap ?? DefaultOptions.generateMipmap
      );
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new Error(`outputBufferSize must be a positive safe integer; received ${capacity}`);
    }

    let result: Uint8Array | null = null;
    const attemptedCapacities: number[] = [];
    for (let attempt = 0; attempt < 2; attempt++) {
      attemptedCapacities.push(capacity);
      const output = new Uint8Array(capacity);
      const byteLength = encoder.encode(output);
      if (byteLength > 0) {
        result = output.slice(0, byteLength);
        break;
      }
      capacity *= 2;
    }
    if (!result) {
      throw new Error(
        `Encode failed after attempts with ${attemptedCapacities.join(" and ")} byte output buffers. ` +
          "The output may be too large, the input or encoder options may be invalid, or the WASM encoder may have exceeded its resource limits."
      );
    }

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
