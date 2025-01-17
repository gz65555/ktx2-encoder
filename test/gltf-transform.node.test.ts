import { Document } from "@gltf-transform/core";
import { ktx2 } from "../src/gltf-transform";
import { expect, test, describe } from "vitest";
import { readFile } from "fs/promises";
import sharp from "sharp";

async function imageDecoder(buffer: Uint8Array) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const data = new Uint8Array(rawBuffer);

  return { width: width!, height: height!, data };
}

describe("ktx2 transform node", () => {
  test("converts png to ktx2", async () => {
    const document = new Document();
    const texture = document.createTexture("test")
      .setImage(await readFile("./public/tests/DuckCM.png"))
      .setMimeType("image/png");

    await document.transform(
      ktx2({
        isUASTC: true,
        enableDebug: false,
        qualityLevel: 230,
        generateMipmap: true,
        imageDecoder
      })
    );

    expect(texture.getMimeType()).toBe("image/ktx2");
    
    const ktx2Data = Array.from(texture.getImage()!);
    const expectedData = Array.from(new Uint8Array(await readFile("./public/tests/DuckCM-uastc.ktx2")));
    expect(ktx2Data).toEqual(expectedData);
  });

  test("filters textures by pattern", async () => {
    const document = new Document();
    const imageBuffer = await readFile("./public/tests/DuckCM.png");
    
    const texture1 = document.createTexture("color")
      .setImage(imageBuffer)
      .setMimeType("image/png")
      .setURI("color.png");
      
    const texture2 = document.createTexture("normal")
      .setImage(imageBuffer)
      .setMimeType("image/png")
      .setURI("normal.png");

    await document.transform(
      ktx2({
        pattern: /^color/,
        isUASTC: true,
        imageDecoder
      })
    );

    expect(texture1.getMimeType()).toBe("image/ktx2");
    expect(texture2.getMimeType()).toBe("image/png");
  });
}); 