import { expect, test } from "vitest";
import { encodeToKTX2 } from "../src/node";
import { nodeEncoder } from "../src/node/NodeBasisEncoder";
import { CubeBufferData } from "../src/type";
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

test("uastc", { timeout: Infinity }, async () => {
  const buffer = await readFile("./public/tests/DuckCM.png");
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    imageDecoder
  });

  const resultBuffer = await readFile("./public/tests/DuckCM-uastc.ktx2");
  const testArray = Array.from(new Uint8Array(resultBuffer));
  const resultArray = Array.from(result);
  expect(testArray).toEqual(resultArray);
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
