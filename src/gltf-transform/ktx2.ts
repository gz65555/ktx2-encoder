import { Document, Transform, Texture } from "@gltf-transform/core";
import { IEncodeOptions } from "../type.js";

const NAME = "ktx2";
const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

function listTextureSlots(texture: Texture): string[] {
  const document = Document.fromGraph(texture.getGraph())!;
  const root = document.getRoot();
  const slots = texture
    .getGraph()
    .listParentEdges(texture)
    .filter((edge) => edge.getParent() !== root)
    .map((edge) => edge.getName());
  return Array.from(new Set(slots));
}

function createTransform(name: string, fn: Transform): Transform {
  Object.defineProperty(fn, "name", { value: name });
  return fn;
}

export interface KTX2Options extends IEncodeOptions {
  /** Pattern identifying textures to compress, matched to name or URI */
  pattern?: RegExp | null;
  /** Pattern matching the material texture slots to be compressed */
  slots?: RegExp | null;
}
/**
 * Transforms compatible textures in a glTF asset to KTX2 format.
 * @param options KTX2 compression options
 * @returns Transform
 */
export function ktx2(options: Partial<KTX2Options> = {}): Transform {
  // Merge defaults with provided options
  const patternRe = options.pattern;
  const slotsRe = options.slots;

  return createTransform(NAME, async (document: Document): Promise<void> => {
    // Dynamically import the appropriate encoder
    const { encodeToKTX2 } = typeof window !== "undefined" 
      ? await import("../web/index.js")
      : await import("../node/index.js");

    const logger = document.getLogger();
    const textures = document.getRoot().listTextures();

    await Promise.all(
      textures.map(async (texture, textureIndex) => {
        const textureLabel = texture.getURI() || texture.getName() || `${textureIndex + 1}/${textures.length}`;
        const prefix = `${NAME}(${textureLabel})`;
        const slots = listTextureSlots(texture);

        // Skip textures that are already KTX2
        if (texture.getMimeType() === "image/ktx2") {
          logger.debug(`${prefix}: Skipping, already KTX2`);
          return;
        }

        // Skip unsupported mime types
        if (!SUPPORTED_MIME_TYPES.includes(texture.getMimeType())) {
          logger.debug(`${prefix}: Skipping, unsupported texture type "${texture.getMimeType()}"`);
          return;
        }

        // Skip textures that don't match pattern
        if (patternRe && !patternRe.test(texture.getName()) && !patternRe.test(texture.getURI())) {
          logger.debug(`${prefix}: Skipping, excluded by "pattern" parameter`);
          return;
        }

        // Skip textures that don't match slots
        if (slotsRe && slots.length && !slots.some((slot) => slotsRe.test(slot))) {
          logger.debug(`${prefix}: Skipping, [${slots.join(", ")}] excluded by "slots" parameter`);
          return;
        }

        try {
          const image = texture.getImage();
          if (!image) {
            logger.warn(`${prefix}: Skipping, no image data`);
            return;
          }

          const srcByteLength = image.byteLength;

          // Encode to KTX2
          const ktx2Data = await encodeToKTX2(image, {
            ...options,
          });
          // Update texture with new KTX2 data
          texture.setImage(ktx2Data);
          texture.setMimeType("image/ktx2");

          const dstByteLength = ktx2Data.byteLength;
          logger.debug(`${prefix}: Size = ${srcByteLength} → ${dstByteLength} bytes`);
        } catch (error) {
          logger.warn(`${prefix}: Failed to convert texture: ${error.message}`);
          console.log(error);
        }
      })
    );

    logger.debug(`${NAME}: Complete.`);
  });
}
