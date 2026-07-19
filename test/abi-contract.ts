import { expect } from "vitest";
import { BasisTextureType, HDRSourceType, SourceType } from "../src/enum";
import type { IBasisModule } from "../src/type";

// Methods present in both the legacy and v2.5 wrappers that the compatibility
// layer depends on. controlThreading is bound in both WASM variants, but is a
// no-op in the single-threaded build.
const ALWAYS_PRESENT_METHODS = [
  "setDebug",
  "setUASTC",
  "setCreateKTX2File",
  "setMipGen",
  "setYFlip",
  "setQualityLevel",
  "setKTX2UASTCSupercompression",
  "setRDOUASTC",
  "setRDOUASTCQualityScalar",
  "setPackUASTCFlags",
  "setHDR",
  "setUASTCHDRQualityLevel",
  "setPerceptual",
  "setTexType",
  "setSliceSourceImage",
  "setSliceSourceImageHDR",
  "encode",
  "delete",
  "controlThreading"
] as const;

const RENAMED_METHODS = {
  legacy: ["setCompressionLevel", "setNormalMap", "setKTX2SRGBTransferFunc"],
  "v2.5": ["setETC1SCompressionLevel", "setNormalMapPreset", "setKTX2AndBasisSRGBTransferFunc"]
} as const;

const EXPECT_ABI: keyof typeof RENAMED_METHODS = "v2.5";

export function expectModuleSurface(module: IBasisModule): void {
  expect(typeof module.initializeBasis).toBe("function");
  expect(typeof module.BasisEncoder).toBe("function");
}

export function expectEncoderSurface(module: IBasisModule): void {
  const encoder = new module.BasisEncoder();
  try {
    for (const name of ALWAYS_PRESENT_METHODS) {
      expect(typeof Reflect.get(encoder, name), `expected encoder.${name} to be a function`).toBe("function");
    }

    const expected = RENAMED_METHODS[EXPECT_ABI];
    const other = EXPECT_ABI === "legacy" ? RENAMED_METHODS["v2.5"] : RENAMED_METHODS.legacy;
    for (const name of expected) {
      expect(typeof Reflect.get(encoder, name), `expected ${EXPECT_ABI} method encoder.${name} to exist`).toBe(
        "function"
      );
    }
    for (const name of other) {
      expect(typeof Reflect.get(encoder, name), `unexpected ${name} present; WASM/glue generation mismatch?`).not.toBe(
        "function"
      );
    }
  } finally {
    encoder.delete();
  }
}

export function expectEnumAbi(): void {
  expect(BasisTextureType.cBASISTexType2D).toBe(0);
  expect(BasisTextureType.cBASISTexTypeCubemapArray).toBe(2);
  expect(SourceType.RAW).toBe(0);
  expect(SourceType.PNG).toBe(1);
  expect(HDRSourceType.EXR).toBe(3);
  expect(HDRSourceType.HDR).toBe(4);
}
