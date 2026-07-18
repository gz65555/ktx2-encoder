# Advanced Usage

## Compression Formats

### ETC1S vs UASTC

KTX2-Encoder supports two compression formats:

- **ETC1S**: Better compression ratios, good for most textures
- **UASTC**: Higher quality, better for normal maps and HDR textures

Choose between them using the `isUASTC` option:

```typescript
// Use ETC1S compression
const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: false
});

// Use UASTC compression
const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: true
});
```

### Quality Settings

For ETC1S compression:

```typescript
const options = {
  isUASTC: false,
  qualityLevel: 128, // Range: 1-255
  compressionLevel: 2 // Range: 0-6
};
```

For UASTC compression:

```typescript
const options = {
  isUASTC: true,
  needSupercompression: true, // Enable Zstandard supercompression (default: true)
  uastcLDRQualityLevel: 1 // Encoder perf vs. quality tradeoff (0-3); higher is slower/better
};
```

#### Rate-Distortion Optimization (RDO)

RDO shrinks the supercompressed UASTC LDR output at some quality cost. It is disabled
by default; enable it and tune the quality scalar as needed:

```typescript
const options = {
  isUASTC: true,
  needSupercompression: true,
  enableRDO: true,
  rdoQualityLevel: 1.0 // Range: 0.001-10; lower values favor quality, higher favor size
};
```

## HDR Encoding

The encoder can produce HDR textures via UASTC HDR. HDR mode differs from the normal
(LDR) path in a few important ways:

- It is only supported together with UASTC (`isHDR` implies UASTC HDR encoding).
- The source must be the **raw bytes of a `.hdr` (Radiance RGBE) or `.exr` file**, and
  `imageType` must say which container it is.
- **No `imageDecoder` is required** — HDR buffers are handed to the encoder directly,
  so this path works the same in browsers and Node.js.

```typescript
import { encodeToKTX2 } from "ktx2-encoder";

// `source` is the untouched contents of a .hdr or .exr file
const ktx2Data = await encodeToKTX2(source, {
  isHDR: true,
  imageType: "hdr", // "hdr" for Radiance .hdr, "exr" for OpenEXR
  hdrQualityLevel: 1 // Optional, range 0-4; higher is slower/better
});
```

## Custom WASM Loading

Browser builds first load the package's version-matched `basis_encoder.wasm` asset. If that request fails, the encoder falls back to the project's CDN-hosted copy. No third-party request is made when the bundled asset is available.

To host the WASM asset yourself or use a CDN, override `wasmUrl`:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  wasmUrl: "/assets/basis_encoder.wasm"
});
```

The custom WASM file must come from the same `ktx2-encoder` version as the bundled JavaScript glue. The legacy `jsUrl` option is deprecated and ignored because replacing only the glue can create an incompatible module pair.

When `wasmUrl` is set explicitly, a failed request is reported directly and does not fall back to the default CDN.

## Node.js Usage

When using in Node.js, you need to provide an image decoder:

```typescript
import sharp from "sharp";

const imageDecoder = async (buffer: Uint8Array) => {
  const { data, info } = await sharp(buffer).raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  return {
    data: new Uint8Array(data),
    width: info.width,
    height: info.height
  };
};

const ktx2Data = await encodeToKTX2(pngBuffer, {
  imageDecoder
});
```

## Custom KV Data

You can include custom key-value metadata in the KTX2 file:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  kvData: {
    myKey: "myValue",
    customData: new Uint8Array([1, 2, 3])
  }
});
```

## Output Buffer Size

Encoding writes into a pre-allocated output buffer. By default its capacity is
estimated from the decoded input dimensions, and if encoding overflows that buffer the
encoder automatically retries **once** with twice the capacity.

You normally don't need to touch this. Set `outputBufferSize` (in bytes) only to skip
the estimate — for example when you already know the output is unusually large and want
to avoid the retry, or to cap the initial allocation:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  outputBufferSize: 8 * 1024 * 1024 // 8 MB initial capacity
});
```

## Using an Encoder Instance

The package also exports the encoder classes directly. Reusing a single instance keeps
the WebAssembly module initialized once across many `encode()` calls, which is useful in
batch tools or long-running workers:

```typescript
// Browser
import { BrowserBasisEncoder } from "ktx2-encoder";

const encoder = new BrowserBasisEncoder();
const a = await encoder.encode(bufferA, { isUASTC: true });
const b = await encoder.encode(bufferB, { isUASTC: true });
```

```typescript
// Node.js
import { NodeBasisEncoder } from "ktx2-encoder";

const encoder = new NodeBasisEncoder();
const ktx2Data = await encoder.encode(pngBuffer, { imageDecoder });
```

The functional `encodeToKTX2` helpers are thin wrappers around shared default instances
(`browserEncoder` / `nodeEncoder`), so most callers can just use those.
