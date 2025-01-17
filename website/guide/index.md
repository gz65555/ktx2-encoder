# Getting Started

A lightweight JavaScript library for converting images to KTX2 (.ktx2) format. Powered by [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal).

## Installation

```shell
npm install ktx2-encoder
```

## Basic Usage

```javascript
import { encodeToKTX2 } from 'ktx2-encoder';

// Convert a single image
const ktx2Data = await encodeToKTX2(imageArrayBuffer, {
  isUASTC: false,
  generateMipmap: true
});
```

## glTF Transform Integration

```typescript
import { ktx2 } from "ktx2-encoder/gltf-transform";

await document.transform(
  ktx2({
    isUASTC: true,
    enableDebug: false,
    generateMipmap: true,
    wasmUrl: "/basis_encoder.wasm"
  })
);
```

## Web Tool

Start the development server:

```shell
npm run dev
```

Then open http://localhost:5174 in your browser to use the web-based conversion tool. 