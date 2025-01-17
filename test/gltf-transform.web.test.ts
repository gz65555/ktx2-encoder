import { Document } from "@gltf-transform/core";
import { ktx2 } from "../src/gltf-transform";
import { expect, test, describe } from "vitest";

describe("ktx2 transform browser", () => {
  test("converts png to ktx2", async () => {
    const document = new Document();
    const imageResponse = await fetch("/tests/DuckCM.png");
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const texture = document.createTexture("test")
      .setImage(new Uint8Array(imageBuffer))
      .setMimeType("image/png");
      
    await document.transform(
      ktx2({
        isUASTC: true,
        enableDebug: false,
        qualityLevel: 230,
        generateMipmap: true,
        wasmUrl: "/basis_encoder.wasm"
      })
    );

    expect(texture.getMimeType()).toBe("image/ktx2");
    
    const ktx2Data = texture.getImage()!;
    const expectedResponse = await fetch("/tests/DuckCM-uastc.ktx2");
    const expectedBuffer = new Uint8Array(await expectedResponse.arrayBuffer());
    expect(ktx2Data).toEqual(expectedBuffer);
  });

  test("filters textures by pattern", async () => {
    const document = new Document();
    const imageResponse = await fetch("/tests/DuckCM.png");
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const texture1 = document.createTexture("color")
      .setImage(new Uint8Array(imageBuffer))
      .setMimeType("image/png")
      .setURI("color.png");

      
    const texture2 = document.createTexture("normal")
      .setImage(new Uint8Array(imageBuffer))
      .setMimeType("image/png")
      .setURI("normal.png");

    await document.transform(
      ktx2({
        pattern: /^color/,
        isUASTC: true,
        wasmUrl: "/basis_encoder.wasm"
      })
    );

    expect(texture1.getMimeType()).toBe("image/ktx2");
    expect(texture2.getMimeType()).toBe("image/png");
  });
}); 