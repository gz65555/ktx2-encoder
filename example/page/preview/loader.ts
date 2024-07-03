import { WebGLEngine, Camera, Vector3, MeshRenderer, PrimitiveMesh, UnlitMaterial, Texture2D } from "@galacean/engine";

export async function initEngine(canvas: HTMLCanvasElement) {
  const engine = await WebGLEngine.create({ canvas, ktx2Loader: { workerCount: 4 } });
  engine.canvas.resizeByClientSize();

  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // Create camera
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.transform.position = new Vector3(0, 0, 1);
  cameraEntity.addComponent(Camera);

  const meshEntity = rootEntity.createChild("mesh");
  meshEntity.transform.setRotation(90, 0, 0);
  const renderer = meshEntity.addComponent(MeshRenderer);
  renderer.mesh = PrimitiveMesh.createPlane(engine);

  const material = new UnlitMaterial(engine);
  material.baseColor.set(0.3, 0.3, 0.3, 1);
  renderer.setMaterial(material);

  engine.run();

  async function loadKTX2(url: string) {
    const texture = await engine.resourceManager.load<Texture2D>(url);
    const aspect = texture.width / texture.height;
    meshEntity.transform.setScale(1, 1, aspect);

    const originTex = material.baseTexture;

    material.baseTexture = texture;
    material.baseColor.set(1, 1, 1, 1);

    if (originTex) {
      originTex.destroy(true);
      engine.resourceManager.gc();
    }
  }

  return loadKTX2;
}
