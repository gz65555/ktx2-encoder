# Usage with glTF Transform

The KTX2-Encoder library provides seamless integration with glTF Transform for converting textures in your glTF/GLB files to KTX2 format.

## Browser Configuration

```typescript
import { ktx2 } from "ktx2-encoder/gltf-transform";

await document.transform(
  ktx2({
    // Use UASTC for higher quality (better for normal maps and HDR textures)
    isUASTC: true,

    // Generate mipmaps for better rendering at different distances
    generateMipmap: true,

    // Enable debug logging (optional)
    enableDebug: false
  })
);
```

The browser build loads its bundled, version-matched WASM module automatically. Set `wasmUrl` only when hosting that file at a custom location.

## Node.js Configuration

Node.js requires an image decoder for non-HDR textures. For example, using `sharp`:

```typescript
import sharp from "sharp";
import { ktx2 } from "ktx2-encoder/gltf-transform";

const imageDecoder = async (buffer: Uint8Array) => {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: new Uint8Array(data), width: info.width, height: info.height };
};

await document.transform(ktx2({ imageDecoder }));
```

## Texture Filtering

Use `pattern` to match texture names or URIs, and `slots` to match material texture slots:

```typescript
await document.transform(
  ktx2({
    pattern: /^(albedo|normal)/i,
    slots: /^(baseColorTexture|normalTexture)$/,
    imageDecoder
  })
);
```

JPEG, PNG, and WebP textures are supported. Existing KTX2 textures and unsupported image types are skipped.

## Important Notes

- UASTC is recommended for normal maps and HDR textures
- ETC1S provides better compression ratios for most other textures
