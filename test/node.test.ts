import { expect, test, vi } from "vitest";
import { encodeToKTX2 } from "../src/node";
import { nodeEncoder } from "../src/node/NodeBasisEncoder";
import { CubeBufferData } from "../src/type";
import { estimateOutputCapacity } from "../src/encodeCore";
import { applyInputOptions } from "../src/applyInputOptions";
import { read } from "ktx-parse";
import { readFile } from "fs/promises";
import sharp from "sharp";

async function imageDecoder(buffer: Uint8Array) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  if (!width || !height) throw new Error("Unable to read image dimensions");
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const data = new Uint8Array(rawBuffer);

  // 创建 imageData 对象
  const imageData = {
    width,
    height,
    data
  };

  return imageData;
}

test("applies an HDR quality level of zero", async () => {
  const module = await nodeEncoder.init();
  const encoder = new module.BasisEncoder();
  const setQualityLevel = vi.spyOn(encoder, "setUASTCHDRQualityLevel");
  try {
    applyInputOptions({ isHDR: true, imageType: "hdr", hdrQualityLevel: 0 }, encoder);
    expect(setQualityLevel).toHaveBeenCalledWith(0);
  } finally {
    encoder.delete();
  }
});

test("uastc", { timeout: Infinity }, async () => {
  const buffer = await readFile("./public/tests/DuckCM.png");
  const resultBuffer = await readFile("./public/tests/DuckCM-uastc.ktx2");
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    imageDecoder,
    outputBufferSize: Math.ceil(resultBuffer.byteLength / 2)
  });

  const testArray = Array.from(new Uint8Array(resultBuffer));
  const resultArray = Array.from(result);
  expect(testArray).toEqual(resultArray);
});

test("estimates output buffer capacity", () => {
  const headerSlack = 64 * 1024;

  expect(estimateOutputCapacity([{ width: 4, height: 4 }], 0, false, false)).toBe(headerSlack + 64);
  expect(estimateOutputCapacity([{ width: 3, height: 5 }], 0, false, true)).toBe(headerSlack + 80);
  expect(
    estimateOutputCapacity(
      Array.from({ length: 6 }, () => ({ width: 4, height: 4 })),
      0,
      false,
      false
    )
  ).toBe(headerSlack + 384);
  expect(estimateOutputCapacity([{ width: 0, height: 0 }], 0, false, false)).toBe(headerSlack);
  expect(estimateOutputCapacity(null, 1024, true, true)).toBe(24 * 1024 * 1024 + headerSlack);
});

test("reports attempted output buffer sizes when encoding fails", { timeout: Infinity }, async () => {
  const buffer = await readFile("./public/tests/DuckCM.png");

  await expect(
    encodeToKTX2(new Uint8Array(buffer), {
      isUASTC: true,
      imageDecoder,
      outputBufferSize: 1
    })
  ).rejects.toThrow(
    "Encode failed after attempts with 1 and 2 byte output buffers. The output may be too large, the input or encoder options may be invalid, or the WASM encoder may have exceeded its resource limits."
  );
});

test("etc1s", { timeout: Infinity }, async () => {
  const buffer = await readFile("./public/tests/DuckCM.png");
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: false,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    imageDecoder
  });

  const resultBuffer = await readFile("./public/tests/DuckCM-etc1s.ktx2");
  const testArray = Array.from(new Uint8Array(resultBuffer));
  const resultArray = Array.from(result);
  expect(testArray).toEqual(resultArray);
});

test("kvData", { timeout: Infinity }, async () => {
  const buffer = await readFile("./public/tests/DuckCM.png");
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    imageDecoder,
    kvData: { testKey: "testValue" }
  });

  expect(read(result).keyValue.testKey).toEqual(new TextEncoder().encode("testValue\0"));
});

test("textureCube", { timeout: Infinity }, async () => {
  const paths = ["posx", "negx", "posy", "negy", "posz", "negz"];
  const buffers = await Promise.all(paths.map((path) => readFile(`./public/tests/cubemap/${path}.jpg`)));
  const cubeData: CubeBufferData = [
    new Uint8Array(buffers[0]),
    new Uint8Array(buffers[1]),
    new Uint8Array(buffers[2]),
    new Uint8Array(buffers[3]),
    new Uint8Array(buffers[4]),
    new Uint8Array(buffers[5])
  ];
  const result = await nodeEncoder.encode(cubeData, {
    isUASTC: false,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: false,
    imageDecoder
  });

  expect(read(result).faceCount).toBe(6);
});
