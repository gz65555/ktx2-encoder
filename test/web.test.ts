import { expect, test } from "vitest";
import { CubeBufferData, encodeToKTX2 } from "../src/web";

test("uastc", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    wasmUrl: "/basis_encoder.wasm"
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

test("textureCube", async () => {
  await Promise.all([
    fetch("/tests/cubemap/posx.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negx.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/posy.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negy.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/posz.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negz.jpg").then((res) => res.arrayBuffer())
  ]).then(async (buffers) => {
    const result = await encodeToKTX2(buffers.map((buffer) => new Uint8Array(buffer)) as CubeBufferData, {
      isUASTC: false,
      enableDebug: false,
      qualityLevel: 230,
      generateMipmap: true
    });
    // TODO: check the result, compress the jpg to test the result
    expect(result).toBeDefined();
  });
});
