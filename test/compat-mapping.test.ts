// Phase 2 (WASM_UPDATE_PLAN §5.2): verify applyInputOptions bridges the three
// setters renamed in Basis Universal v2.5 across BOTH WASM generations, using
// mock encoders — so both branches are covered in isolation, including the
// legacy fallback that the shipped v2.5 WASM never exercises.
import { describe, expect, test, vi } from "vitest";
import { applyInputOptions } from "../src/applyInputOptions";

type Spy = ReturnType<typeof vi.fn<(...args: unknown[]) => void>>;

// Every setter applyInputOptions may call, as no-op spies.
function baseEncoder(): Record<string, Spy> {
  const names = [
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
    "setPerceptual"
  ];
  return Object.fromEntries(names.map((n) => [n, vi.fn<(...args: unknown[]) => void>()]));
}

const RENAME_TRIGGERING_OPTIONS = {
  isSetKTX2SRGBTransferFunc: true,
  isNormalMap: true,
  compressionLevel: 3
};

describe("renamed-setter bridging", () => {
  test("legacy WASM: uses the old method names", () => {
    const enc = baseEncoder();
    enc.setKTX2SRGBTransferFunc = vi.fn<(...args: unknown[]) => void>();
    enc.setNormalMap = vi.fn<(...args: unknown[]) => void>();
    enc.setCompressionLevel = vi.fn<(...args: unknown[]) => void>();

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- deliberate encoder mock
    applyInputOptions(RENAME_TRIGGERING_OPTIONS, enc as never);

    expect(enc.setKTX2SRGBTransferFunc).toHaveBeenCalledWith(true);
    expect(enc.setNormalMap).toHaveBeenCalledTimes(1);
    expect(enc.setCompressionLevel).toHaveBeenCalledWith(3);
  });

  test("v2.5 WASM: uses the renamed methods and never the legacy ones", () => {
    const enc = baseEncoder();
    enc.setKTX2AndBasisSRGBTransferFunc = vi.fn<(...args: unknown[]) => void>();
    enc.setNormalMapPreset = vi.fn<(...args: unknown[]) => void>();
    enc.setETC1SCompressionLevel = vi.fn<(...args: unknown[]) => void>();
    // Legacy names present as spies to prove they are NOT called on v2.5.
    enc.setKTX2SRGBTransferFunc = vi.fn<(...args: unknown[]) => void>();
    enc.setNormalMap = vi.fn<(...args: unknown[]) => void>();
    enc.setCompressionLevel = vi.fn<(...args: unknown[]) => void>();

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- deliberate encoder mock
    applyInputOptions(RENAME_TRIGGERING_OPTIONS, enc as never);

    expect(enc.setKTX2AndBasisSRGBTransferFunc).toHaveBeenCalledWith(true);
    expect(enc.setNormalMapPreset).toHaveBeenCalledTimes(1);
    expect(enc.setETC1SCompressionLevel).toHaveBeenCalledWith(3);

    expect(enc.setKTX2SRGBTransferFunc).not.toHaveBeenCalled();
    expect(enc.setNormalMap).not.toHaveBeenCalled();
    expect(enc.setCompressionLevel).not.toHaveBeenCalled();
  });
});
