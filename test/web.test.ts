import { expect, test } from "vitest";
import { encodeToKTX2 } from "../src/web";

test("uastc", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true
  });

  const resultBuffer = await fetch("/tests/DuckCM-uastc.ktx2").then((res) => res.arrayBuffer());
  expect(result).toEqual(new Uint8Array(resultBuffer));
});

test("etc1s", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: false,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true
  });

  const resultBuffer = await fetch("/tests/DuckCM-etc1s.ktx2").then((res) => res.arrayBuffer());
  expect(result).toEqual(new Uint8Array(resultBuffer));
});
