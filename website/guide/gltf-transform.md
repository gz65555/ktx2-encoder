# Usage with glTF Transform

The KTX2-Encoder library provides seamless integration with glTF Transform for converting textures in your glTF/GLB files to KTX2 format.

## Configuration

```typescript
import { ktx2 } from "ktx2-encoder/gltf-transform";

await document.transform(
  ktx2({
    // Use UASTC for higher quality (better for normal maps and HDR textures)
    isUASTC: true,
    
    // Generate mipmaps for better rendering at different distances
    generateMipmap: true,
    
    // Path to the WebAssembly module (required)
    wasmUrl: "/basis_encoder.wasm",
    
    // Enable debug logging (optional)
    enableDebug: false
  })
);
```

## Important Notes

- Remember to host the `basis_encoder.wasm` file on your server
- UASTC is recommended for normal maps and HDR textures
- ETC1S provides better compression ratios for most other textures 