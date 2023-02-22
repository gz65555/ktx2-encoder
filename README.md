# ktx-encoder

This is a simple tool to convert images to KTX2 format. Ported from [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal).

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
# ktx2-encoder
