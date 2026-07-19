# ktx2-encoder

[![Latest NPM release](https://img.shields.io/npm/v/ktx2-encoder.svg)](https://www.npmjs.com/package/ktx2-encoder) [![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/gz65555/ktx2-encoder)

A lightweight JavaScript library for converting images to KTX2 (.ktx2) format. Powered by [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal).

## Features

- Convert images to KTX2 format
- Support for both 2D images and cubemaps
- Integration with gltf-transform
- Support both Browser and Node.js

## Quick Start

Install:

```shell
npm install --save ktx2-encoder
```

Import and encode an image:

```javascript
import { encodeToKTX2 } from "ktx2-encoder";

const source = new Uint8Array(await file.arrayBuffer());
const ktx2Data = await encodeToKTX2(source, {
  isUASTC: true,
  generateMipmap: true
});
```

In browsers, `encodeToKTX2` also accepts exactly six `Uint8Array` images to encode a cubemap, ordered as `[posx, negx, posy, negy, posz, negz]`.

See the [API guide](./website/guide/api.md) for more details.

## For gltf-transform

For users of [glTF Transform](https://gltf-transform.dev/), use the provided `ktx2` transform. In Node.js, pass an `imageDecoder`; browser builds provide one automatically.

```typescript
import { ktx2 } from "ktx2-encoder/gltf-transform";
import sharp from "sharp";

const imageDecoder = async (buffer: Uint8Array) => {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: new Uint8Array(data), width: info.width, height: info.height };
};

await document.transform(
  ktx2({
    isUASTC: true,
    enableDebug: false,
    generateMipmap: true,
    imageDecoder
  })
);
```

The browser build loads its bundled, version-matched `basis_encoder.wasm` automatically, with no CDN fallback. To serve a matching WASM file from a custom location, set `wasmUrl` explicitly. See the [advanced guide](./website/guide/advanced.md#custom-wasm-loading).

## Tool

Open the page of [ktx2 encoder tool](https://husong.me/ktx2-encoder/tools), you can use it to encode your image to ktx2.
