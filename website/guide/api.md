# API Reference

## Core Functions

### encodeToKTX2

The main function for converting images to KTX2 format.

```typescript
async function encodeToKTX2(
  imageBuffer: Uint8Array, 
  options?: Partial<IEncodeOptions>
): Promise<Uint8Array>
```

#### Parameters

- `imageBuffer`: Raw image data as Uint8Array
- `options`: Optional configuration object (see IEncodeOptions below)

#### Example

```typescript
import { encodeToKTX2 } from 'ktx2-encoder';

const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: true,
  generateMipmap: true,
  isNormalMap: false
});
```

### encodeKTX2Cube

Function for converting cubemap images to KTX2 format.

```typescript
async function encodeKTX2Cube(
  imageBuffers: Uint8Array[], 
  options?: Partial<IEncodeOptions>
): Promise<Uint8Array>
```

#### Parameters

- `imageBuffers`: Array of 6 image buffers for each cubemap face
- `options`: Same options as encodeToKTX2

#### Example

```typescript
const ktx2Data = await encodeKTX2Cube([
  posx, negx, posy, negy, posz, negz
], {
  isUASTC: true,
  generateMipmap: true
});
```

## Configuration Options

### IEncodeOptions Interface

Complete configuration options for the encoder:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `isUASTC` | boolean | true | Use UASTC texture format instead of ETC1S |
| `enableDebug` | boolean | false | Enable debug output |
| `isYFlip` | boolean | false | If true, the source images will be Y flipped before compression |
| `qualityLevel` | number | -1(unused) | Sets the ETC1S encoder's quality level (1-255). Controls file size vs. quality tradeoff |
| `compressionLevel` | number | 2 | Controls encoder performance vs. file size tradeoff for ETC1S files (0-6) |
| `needSupercompression` | boolean | false | Use UASTC Zstandard supercompression |
| `isNormalMap` | boolean | false | Optimize compression parameters for normal maps |
| `isSetKTX2SRGBTransferFunc` | boolean | false | Input source is sRGB. Should match the "perceptual" setting |
| `generateMipmap` | boolean | false | Generate mipmaps from source images |
| `isKTX2File` | boolean | false | Create .KTX2 files instead of .basis files |
| `kvData` | Record<string, string \| Uint8Array> | {} | Custom key-value metadata for the KTX2 file |
| `type` | SourceType | - | Type of input source (RAW = 0, PNG = 1) |
| `imageDecoder` | Function | undefined | Function to decode compressed image buffer to RGBA (Required for Node.js) |
| `jsUrl` | string | undefined | URL to the JavaScript module |
| `wasmUrl` | string | undefined | URL to the WebAssembly module |

### Image Decoder Function Type

For Node.js usage, the `imageDecoder` function should match this signature:

```typescript
type ImageDecoder = (
  buffer: Uint8Array
) => Promise<{
  width: number;
  height: number;
  data: Uint8Array;
}>;
```

### Source Type Enum

```typescript
enum SourceType {
  RAW = 0,
  PNG = 1
}
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
  isUASTC: true,  // Recommended for normal maps
  isNormalMap: true,
  isSetKTX2SRGBTransferFunc: false  // Important for normal maps
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

### With Custom Metadata

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  kvData: {
    'myKey': 'myValue',
    'customData': new Uint8Array([1, 2, 3])
  }
});
``` 