# Third-Party Notices

`ktx2-encoder` (MIT, see [LICENSE](./LICENSE)) bundles a precompiled build of the **Basis Universal** encoder as `dist/basis/basis_encoder.js` and `dist/basis/basis_encoder.wasm`. That component is distributed under the Apache License 2.0, and its attribution notice is reproduced below as required by Apache-2.0 §4(d).

## Basis Universal

- Project: Basis Universal — https://github.com/BinomialLLC/basis_universal
- License: Apache License 2.0
- Upstream: https://www.apache.org/licenses/LICENSE-2.0

### NOTICE (reproduced)

```
Basis Universal™ Supercompressed GPU Texture Compression Library

Copyright © 2016–2026 Binomial LLC.
All rights reserved except as granted under the Apache 2.0 license
(https://github.com/BinomialLLC/basis_universal/blob/master/LICENSE).
"Basis Universal" is a trademark of Binomial LLC.

The documents in the Basis Universal wiki, and the Basis Universal library,
example, and tool source code, fall under the Apache 2.0 license, unless
otherwise explicitly indicated.

Redistributions or derivative works must include a readable copy of the
attribution notices from this NOTICE file (see Apache License 2.0 §4(d)).
```

### Bundled build provenance

The `basis_encoder.{js,wasm}` shipped in this package were built from:

- Upstream commit: `1b33fd5098c6e7b58324146b8f5518cbb4cdfb72` (2026-07-05)
- Toolchain: Emscripten 4.0.15
- Config: wasm32 (non-threaded) Release, `KTX2_ZSTANDARD=ON`, `SUPPORT_ASTCENC=OFF`, `-s EXPORT_ES6=1`
- `basis_encoder.wasm` SHA-256: `9807719e87cf3d979b0d69ae7112eb88aec6a0e0206c0b2d00dc0bed0d581b80`

This build is a redistribution of the upstream binary; the ktx2-encoder project does not modify the Basis Universal source.

### Components within the Basis Universal build

The Apache-2.0 encoder library additionally links these third-party components:

- **Zstandard** — BSD-3-Clause, © Meta Platforms, Inc. (KTX2 supercompression)
- **tinyexr / tiny_dds / QOI loaders** — MIT

See the upstream [LICENSES folder](https://github.com/BinomialLLC/basis_universal/tree/master/LICENSES) for the full text of each.
