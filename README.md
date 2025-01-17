# ktx2-encoder

[![Latest NPM release](https://img.shields.io/npm/v/ktx2-encoder.svg)](https://www.npmjs.com/package/ktx2-encoder)
[![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/gz65555/ktx2-encoder)

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

Import: 

```javascript
import { encodeToKTX2, encodeKTX2Cube } from 'ktx2-encoder';
```

Usage:

```javascript
// encode a 2D image
encodeToKTX2(data /** ArrayBuffer of png */, options);
// encode a cube map
encodeKTX2Cube([data, ...] /** ArrayBuffer of png */, options);
```

See [options](./docs/interfaces/IEncodeOptions.md) API documentation for more details.

## For gltf-transform

For the users of [gltf-transform](https://gltf-transform.dev/), you can use the provided function `ktx`. For example:

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

> **Note:** It's recommended to host the `basis_encoder.wasm` file on your own server.

## Tool

1. Start server

```
npm run dev
```

2. Open the page，default is http://localhost:5174/

3. Use it! Select your images and encode it to ktx2![lock](https://mdn.alipayobjects.com/rms/afts/img/A*himnRpVKEvgAAAAAAAAAAAAAARQnAQ/original/lock.gif)
