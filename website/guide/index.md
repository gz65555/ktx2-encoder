# Getting Started

A lightweight JavaScript library for converting images to KTX2 (.ktx2) format. Powered by [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal).

## Installation

```shell
npm install ktx2-encoder
```

## Basic Usage

```javascript
import { encodeToKTX2 } from "ktx2-encoder";

// Convert a single image
const imageBytes = new Uint8Array(await file.arrayBuffer());
const ktx2Data = await encodeToKTX2(imageBytes, {
  isUASTC: false,
  generateMipmap: true
});
```

Browser builds decode supported image formats automatically. Node.js callers must provide an `imageDecoder`; see [Advanced Usage](./advanced.md#nodejs-usage).

## glTF Transform Integration

```typescript
import { ktx2 } from "ktx2-encoder/gltf-transform";

await document.transform(
  ktx2({
    isUASTC: true,
    enableDebug: false,
    generateMipmap: true
  })
);
```

## Web Tool

Start the development server:

```shell
npm run docs:dev
```

Open the local URL printed by VitePress to use the web-based conversion tool.
