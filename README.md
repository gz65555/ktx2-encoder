# ktx-encoder

[![Latest NPM release](https://img.shields.io/npm/v/ktx2-encoder.svg)](https://www.npmjs.com/package/ktx2-encoder)
[![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/gz65555/ktx2-encoder)


This is a simple tool to convert images to KTX2(.ktx2) format. Ported from [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal).

## Quick Start

Install:

```shell
npm install --save ktx-encoder
```

Import: 
```javascript
import { encodeKTX2, encodeKTX2Cube, release } from 'ktx-encoder';
```

Usage:

```javascript
// encode a 2D image
encodeKTX2(data /** ArrayBuffer of png */, options);
// encode a cube map
encodeKTX2Cube([data, ...] /** ArrayBuffer of png */, options);
```

See [options](./docs/interfaces/IEncodeOptions.md) API documentation for more details.
