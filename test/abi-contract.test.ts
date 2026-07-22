// Persistent Node-side ABI regression gate for the default single-threaded
// module. The threaded browser module is checked by abi-contract-threads.test.ts
// under a cross-origin isolated Chromium instance.
import { describe, test } from "vitest";
import { nodeEncoder } from "../src/node/NodeBasisEncoder";
import { expectEncoderSurface, expectEnumAbi, expectModuleSurface } from "./abi-contract";

describe("single-threaded module ABI", () => {
  test("module load surface", async () => {
    expectModuleSurface(await nodeEncoder.init());
  });

  test("BasisEncoder method surface", async () => {
    expectEncoderSurface(await nodeEncoder.init());
  });

  test("enum values", () => {
    expectEnumAbi();
  });
});
