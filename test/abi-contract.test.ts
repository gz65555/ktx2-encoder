// Phase 0 (WASM_UPDATE_PLAN_V1_2.md §5.6): ABI contract test.
//
// This is the persistent regression gate for the JS/WASM ABI the compat layer
// depends on. It is intentionally NOT part of the default `npm test` run
// (which only executes node.test.ts / web.test.ts); run it with
// `npm run test:abi`.
//
// It asserts EXACTLY ONE target generation via the `EXPECT_ABI` switch below,
// so that a JS-glue / WASM mismatch fails loudly instead of being papered over.
//
//   - Currently the repo ships the legacy WASM  -> EXPECT_ABI = "legacy".
//   - Phase 3 (product sync) swaps in the v2.5 WASM. When that happens, flip
//     EXPECT_ABI to "v2.5" IN THE SAME COMMIT. If the glue and WASM disagree
//     with EXPECT_ABI, this test fails, which is the intended signal.
//
// Method inventory and enum values were verified against basis_universal
// @ 1b33fd5098c6e7b58324146b8f5518cbb4cdfb72 (webgl/transcoder/basis_wrappers.cpp
// and transcoder/basisu_file_headers.h / encoder/basisu_enc.h).

import { expect, test, describe } from "vitest";
import { nodeEncoder } from "../src/node/NodeBasisEncoder";
import { BasisTextureType, SourceType, HDRSourceType } from "../src/enum";

// ---------------------------------------------------------------------------
// Phase 3 migration switch. Flip to "v2.5" in the commit that bundles the new
// WASM. See header.
// ---------------------------------------------------------------------------
const EXPECT_ABI: "legacy" | "v2.5" = "v2.5";

// Methods present in BOTH the legacy and v2.5 wrappers that the compat layer
// (src/applyInputOptions.ts + src/encodeCore.ts) depends on.
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
  "delete"
] as const;

// Methods renamed between legacy and v2.5 (WASM_UPDATE_PLAN_V1_2.md §5.2).
const RENAMED_METHODS = {
  legacy: ["setCompressionLevel", "setNormalMap", "setKTX2SRGBTransferFunc"],
  "v2.5": ["setETC1SCompressionLevel", "setNormalMapPreset", "setKTX2AndBasisSRGBTransferFunc"]
} as const;

async function withEncoder<T>(fn: (encoder: any) => T): Promise<T> {
  const module = await nodeEncoder.init();
  const encoder = new module.BasisEncoder();
  try {
    return fn(encoder);
  } finally {
    encoder.delete();
  }
}

describe("module load surface", () => {
  test("factory resolves to a module exposing initializeBasis and BasisEncoder", async () => {
    const module = await nodeEncoder.init();
    expect(typeof module.initializeBasis).toBe("function");
    expect(typeof module.BasisEncoder).toBe("function");
  });
});

describe("BasisEncoder method surface", () => {
  test("all always-present methods exist", async () => {
    await withEncoder((encoder) => {
      for (const name of ALWAYS_PRESENT_METHODS) {
        expect(typeof encoder[name], `expected encoder.${name} to be a function`).toBe("function");
      }
    });
  });

  test(`renamed methods match EXPECT_ABI = "${EXPECT_ABI}"`, async () => {
    const expected = RENAMED_METHODS[EXPECT_ABI];
    const other = EXPECT_ABI === "legacy" ? RENAMED_METHODS["v2.5"] : RENAMED_METHODS.legacy;
    await withEncoder((encoder) => {
      for (const name of expected) {
        expect(typeof encoder[name], `expected ${EXPECT_ABI} method encoder.${name} to exist`).toBe("function");
      }
      // Loud mismatch: the other generation's renamed methods must be absent.
      for (const name of other) {
        expect(typeof encoder[name], `unexpected ${name} present; WASM/glue generation mismatch?`).not.toBe("function");
      }
    });
  });
});

describe("enum ABI (src/enum.ts vs verified upstream values)", () => {
  // Guards against accidental edits to src/enum.ts. The upstream values are
  // fixed for the formats this project uses; see basisu_file_headers.h and
  // basisu_enc.h at the pinned commit.
  test("BasisTextureType", () => {
    expect(BasisTextureType.cBASISTexType2D).toBe(0);
    expect(BasisTextureType.cBASISTexTypeCubemapArray).toBe(2);
  });

  test("SourceType (ldr_image_type: RGBA32=0, PNG=1)", () => {
    expect(SourceType.RAW).toBe(0);
    expect(SourceType.PNG).toBe(1);
  });

  test("HDRSourceType (hdr_image_type: EXR=3, HDR=4)", () => {
    expect(HDRSourceType.EXR).toBe(3);
    expect(HDRSourceType.HDR).toBe(4);
  });
});

// NOTE (Phase 0 TODO, tracked in IMPLEMENTATION_STATUS.md):
//   - encode() return semantics (byte count / 0 = failure) and the source-texel
//     ceiling behavior are asserted behaviorally in the functional suites once
//     the v2.5 WASM lands; a signature-level check here cannot distinguish the
//     failure reasons. See WASM_UPDATE_PLAN_V1_2.md §5.4 / §6.5.
//   - setSliceSourceImage/HDR arity + boolean return change is not assertable via
//     `typeof`; it is exercised by encodeCore behavior after the swap.
