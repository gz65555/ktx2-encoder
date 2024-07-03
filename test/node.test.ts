import { expect, test } from "vitest";
import { encodeToKTX2 } from "../src/node";
import { readFile } from "fs/promises";
import sharp from "sharp";

async function imageDecoder(buffer: Uint8Array) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const data = new Uint8Array(rawBuffer);

  // 创建 imageData 对象
  const imageData = {
    width: width!,
    height: height!,
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
