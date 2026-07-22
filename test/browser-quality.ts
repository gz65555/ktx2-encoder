import { AssetType, BackgroundMode, Camera, Texture2D, TextureFormat, Vector3, WebGLEngine } from "@galacean/engine";
import { ssim } from "ssim.js";

export async function decodeToImageData(source: string | Uint8Array): Promise<ImageData> {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const engine = await WebGLEngine.create({
    canvas,
    graphicDeviceOptions: { preserveDrawingBuffer: true }
  });
  let objectUrl: string | undefined;

  try {
    const request =
      typeof source === "string"
        ? { url: source }
        : {
            url: (objectUrl = URL.createObjectURL(new Blob([source], { type: "image/ktx2" }))),
            type: AssetType.KTX2
          };
    const texture = await engine.resourceManager.load<Texture2D>(request);
    const width = texture.width;
    const height = texture.height;
    canvas.width = width;
    canvas.height = height;
    console.log(
      `[quality] ${typeof source === "string" ? source : "generated KTX2"}: ` +
        `${width}x${height} format=${TextureFormat[texture.format]}`
    );

    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();
    const cameraEntity = rootEntity.createChild("camera");
    cameraEntity.addComponent(Camera);
    cameraEntity.transform.position = new Vector3(10, 10, 10);
    cameraEntity.transform.lookAt(new Vector3(0, 0, 0));

    scene.background.mode = BackgroundMode.Texture;
    scene.background.texture = texture;
    engine.update();

    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 is required for KTX2 quality tests");
    const pixels = new Uint8ClampedArray(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return new ImageData(pixels, width, height);
  } finally {
    engine.destroy();
    canvas.remove();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

export function mssim(a: ImageData, b: ImageData): number {
  return ssim(a, b, { windowSize: 20, k1: 0.01, k2: 0.025, ssim: "original" }).mssim;
}
