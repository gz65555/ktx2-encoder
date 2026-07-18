# API Reference

## Core Functions

### encodeToKTX2

The main function for converting images to KTX2 format.

```typescript
// Browser
async function encodeToKTX2(
  imageBuffer: Uint8Array | CubeBufferData,
  options?: Partial<IEncodeOptions>
): Promise<Uint8Array>;

// Node.js
async function encodeToKTX2(imageBuffer: Uint8Array, options?: Partial<IEncodeOptions>): Promise<Uint8Array>;
```

#### Parameters

- `imageBuffer`: Encoded image data as a `Uint8Array`. In browsers, a tuple of exactly six image buffers creates a cubemap in the order `[posx, negx, posy, negy, posz, negz]`.
- `options`: Optional configuration object (see IEncodeOptions below)

#### Example

```typescript
import { encodeToKTX2 } from "ktx2-encoder";

const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: true,
  generateMipmap: true,
  isNormalMap: false
});
```

## Configuration Options

### IEncodeOptions Interface

Complete configuration options for the encoder:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `isUASTC` | boolean | true | Use UASTC texture format instead of ETC1S |
| `enableDebug` | boolean | false | Enable debug output |
| `isYFlip` | boolean | false | If true, the source images will be Y flipped before compression |
| `qualityLevel` | number | 150 | Sets the ETC1S encoder's quality level (1-255). Controls file size vs. quality tradeoff |
| `compressionLevel` | number | 2 | Controls encoder performance vs. file size tradeoff for ETC1S files (0-6) |
| `needSupercompression` | boolean | true | Use UASTC Zstandard supercompression |
| `uastcLDRQualityLevel` | number | 1 | Controls UASTC LDR quality (0-3); higher values are slower and higher quality |
| `enableRDO` | boolean | false | Enable UASTC LDR rate-distortion optimization |
| `rdoQualityLevel` | number | 1.0 | Controls UASTC RDO quality (0.001-10); lower values favor quality |
| `isNormalMap` | boolean | false | Optimize compression parameters for normal maps |
| `isPerceptual` | boolean | encoder default | Treat input as perceptual/sRGB data; normally true for color textures and false for normal maps |
| `isSetKTX2SRGBTransferFunc` | boolean | true | Use the sRGB transfer function in the KTX2 DFD; normally matches `isPerceptual` |
| `generateMipmap` | boolean | true | Generate mipmaps from source images |
| `isKTX2File` | boolean | true | Create a KTX2 file instead of a Basis file |
| `isHDR` | boolean | false | Enable UASTC HDR encoding |
| `imageType` | `"hdr" \| "exr"` | required for HDR | HDR source container type |
| `hdrQualityLevel` | number | encoder default | Controls UASTC HDR quality (0-4) |
| `kvData` | Record<string, string \| Uint8Array> | undefined | Custom key-value metadata for the KTX2 file |
| `outputBufferSize` | number | estimated | Initial output buffer capacity in bytes; encoding retries once at twice this size on failure |
| `imageDecoder` | Function | browser built-in | Function that decodes an image buffer to RGBA; required in Node.js for non-HDR images |
| `jsUrl` | string | undefined | Deprecated and ignored in browsers; the bundled JavaScript module is always used |
| `wasmUrl` | string | bundled asset | Browser-only URL overriding the bundled WebAssembly module |

### Image Decoder Function Type

For Node.js usage, the `imageDecoder` function should match this signature:

```typescript
type ImageDecoder = (buffer: Uint8Array) => Promise<{
  width: number;
  height: number;
  data: Uint8Array;
}>;
```

## Examples

### Basic Usage

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: true,
  generateMipmap: true,
  isNormalMap: false
});
```

### Normal Map Compression

```typescript
const normalMapData = await encodeToKTX2(normalMapBuffer, {
  isUASTC: true, // Recommended for normal maps
  isNormalMap: true,
  isSetKTX2SRGBTransferFunc: false // Important for normal maps
});
```

### ETC1S with Quality Settings

```typescript
const etc1sData = await encodeToKTX2(imageBuffer, {
  isUASTC: false,
  qualityLevel: 128,
  compressionLevel: 2
});
```

### Cubemap Encoding

```typescript
import { encodeToKTX2 } from "ktx2-encoder";

// Load your 6 cubemap face images
Promise.all([
  loadImage("posx.jpg"),
  loadImage("negx.jpg"),
  loadImage("posy.jpg"),
  loadImage("negy.jpg"),
  loadImage("posz.jpg"),
  loadImage("negz.jpg")
]).then((buffers) => {
  // Encode to KTX2 cubemap
  return encodeToKTX2(buffers, {
    isUASTC: true,
    generateMipmap: true,
    qualityLevel: 128
  });
});
```

Cubemap encoding through the package entry point is currently available in browser builds.

#### Face Order

The cubemap faces must be provided in this specific order:

- `posx`: Positive X face (+X)
- `negx`: Negative X face (-X)
- `posy`: Positive Y face (+Y)
- `negy`: Negative Y face (-Y)
- `posz`: Positive Z face (+Z)
- `negz`: Negative Z face (-Z)

### With Custom Metadata

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  kvData: {
    myKey: "myValue",
    customData: new Uint8Array([1, 2, 3])
  }
});
```
