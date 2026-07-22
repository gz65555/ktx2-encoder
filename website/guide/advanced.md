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

RDO shrinks the supercompressed UASTC LDR output at some quality cost. It is disabled by default; enable it and tune the quality scalar as needed:

```typescript
const options = {
  isUASTC: true,
  needSupercompression: true,
  enableRDO: true,
  rdoQualityLevel: 1.0 // Range: 0.001-10; lower values favor quality, higher favor size
};
```

## HDR Encoding

The encoder can produce HDR textures via UASTC HDR. HDR mode differs from the normal (LDR) path in a few important ways:

- It is only supported together with UASTC (`isHDR` implies UASTC HDR encoding).
- The source must be the **raw bytes of a `.hdr` (Radiance RGBE) or `.exr` file**, and `imageType` must say which container it is.
- HDR buffers are handed to the encoder directly, so the browser helper does not need an `imageDecoder`. In Node.js, use `NodeBasisEncoder` directly to avoid the functional helper's decoder validation.

```typescript
import { encodeToKTX2 } from "ktx2-encoder";

// `source` is the untouched contents of a .hdr or .exr file
const ktx2Data = await encodeToKTX2(source, {
  isHDR: true,
  imageType: "hdr", // "hdr" for Radiance .hdr, "exr" for OpenEXR
  hdrQualityLevel: 1 // Optional, range 0-4; higher is slower/better
});
```

In Node.js, encode the same input through an encoder instance:

```typescript
import { NodeBasisEncoder } from "ktx2-encoder";

const encoder = new NodeBasisEncoder();
const ktx2Data = await encoder.encode(source, {
  isHDR: true,
  imageType: "hdr",
  hdrQualityLevel: 1
});
```

## Multithreaded Encoding

The browser build ships a second, multithreaded encoder that can use WASM threads to speed up encoding. It is **opt-in** and **off by default**. Enable it per call with `useThreads`:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  useThreads: true,
  numThreads: 4 // optional; extra worker threads (total = 1 + numThreads)
});
```

- `numThreads` is the number of **extra** worker threads (total parallelism is `1 + numThreads`). It is clamped to `[0, 8]`; `0` disables threading. The default is `min(navigator.hardwareConcurrency - 1, 8)`.
- Threading helps most on **large textures**. Small inputs see little benefit because the encoder's serial phases dominate; a 2K image is only modestly faster, while a near-cap (~11 Mpix) ETC1S encode can be several times faster.

### Requirement: cross-origin isolation

WASM threads use `SharedArrayBuffer`, which browsers only expose to **cross-origin isolated** pages. Your page must be served with these response headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

You can confirm at runtime that `crossOriginIsolated === true`. If `useThreads` is requested on a page that is **not** cross-origin isolated, the encoder logs one warning and transparently falls back to the single-threaded build — encoding still succeeds. (Note that COEP `require-corp` also constrains other cross-origin resources your page loads.)

For local Vite development and preview, configure both servers ([Vite server headers](https://vite.dev/config/server-options.html#server-headers)):

```typescript
import { defineConfig } from "vite";

const isolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp"
};

export default defineConfig({
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders }
});
```

On Vercel, add response headers in [`vercel.json`](https://vercel.com/docs/project-configuration/vercel-json#headers):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

On Netlify, put a [`_headers`](https://docs.netlify.com/manage/routing/headers/) file in the publish directory:

```text
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

After deployment, check both headers on the top-level document and verify `crossOriginIsolated` in the browser console. Any cross-origin scripts, images, fonts, or other assets must also satisfy COEP through CORS or an appropriate `Cross-Origin-Resource-Policy` response header.

The multithreaded WASM (`basis_encoder_threads.wasm`, ~3.3 MB) is loaded lazily only when you first opt in, so it costs nothing for consumers that don't use it. To self-host it, point `threadsWasmUrl` at the **threaded** asset — this is a separate option from `wasmUrl` because the two builds ship different, non-interchangeable binaries:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  useThreads: true,
  threadsWasmUrl: "/assets/basis_encoder_threads.wasm",
  // wasmUrl is used if the page is not cross-origin isolated and threading
  // falls back to single-threaded; point it at the single-threaded build.
  wasmUrl: "/assets/basis_encoder.wasm"
});
```

Multithreading is **browser-only**; `useThreads` is ignored in Node.js.

Thread scheduling can change work ordering, so output produced with different thread counts is not guaranteed to be byte-for-byte identical. Decode and compare quality when reproducibility matters; the library's tests use SSIM rather than encoded-byte equality across variants.

## Custom WASM Loading

Browser builds load the package's version-matched, bundled `basis_encoder.wasm` asset automatically. No third-party or CDN request is ever made.

To host the WASM asset yourself, override `wasmUrl`:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  wasmUrl: "/assets/basis_encoder.wasm"
});
```

The custom WASM file must come from the same `ktx2-encoder` version as the bundled JavaScript glue. The legacy `jsUrl` option is deprecated and ignored because replacing only the glue can create an incompatible module pair.

If the WASM asset (bundled or custom) cannot be fetched, the encoder throws an error that includes the URL and HTTP status — it does not fall back to any other source.

When self-hosting the `.wasm` file, serve it with the `application/wasm` MIME type so the browser can stream-compile it. If your host sends a generic type (e.g. `application/octet-stream`), loading still works but skips streaming compilation.

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

Encoding writes into a pre-allocated output buffer. By default its capacity is estimated from the decoded input dimensions, and if encoding overflows that buffer the encoder automatically retries **once** with twice the capacity.

You normally don't need to touch this. Set `outputBufferSize` (in bytes) only to skip the estimate — for example when you already know the output is unusually large and want to avoid the retry, or to cap the initial allocation:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  outputBufferSize: 8 * 1024 * 1024 // 8 MB initial capacity
});
```

## Using an Encoder Instance

The package also exports the encoder classes directly. Reusing a single instance keeps the WebAssembly module initialized once across many `encode()` calls, which is useful in batch tools or long-running workers:

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

The functional `encodeToKTX2` helpers are thin wrappers around shared default instances (`browserEncoder` / `nodeEncoder`), so most callers can just use those.
