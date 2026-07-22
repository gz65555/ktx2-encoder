# Third-Party Notices

`ktx2-encoder` (MIT, see [LICENSE](./LICENSE)) bundles precompiled builds of the **Basis Universal** encoder: a single-threaded build (`dist/basis/basis_encoder.{js,wasm}`, always loaded) and an opt-in multithreaded build (`dist/basis-threads/basis_encoder_threads.{js,wasm}`, loaded only when the page is cross-origin isolated). Both are distributed under the Apache License 2.0, and its attribution notice is reproduced below as required by Apache-2.0 §4(d).

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

Both variants shipped in this package were built from the same pinned source via `scripts/build-basis-wasm.sh`:

- Upstream commit: `1b33fd5098c6e7b58324146b8f5518cbb4cdfb72` (2026-07-05)
- Toolchain: Emscripten 4.0.15

**Single-threaded** (`dist/basis/`, the default):

- Config: wasm32 (non-threaded) Release, `KTX2_ZSTANDARD=ON`, `SUPPORT_ASTCENC=OFF`, `-s EXPORT_ES6=1`
- `basis_encoder.wasm` SHA-256: `9807719e87cf3d979b0d69ae7112eb88aec6a0e0206c0b2d00dc0bed0d581b80`

**Multithreaded** (`dist/basis-threads/`, opt-in, requires cross-origin isolation):

- Config: wasm32 + pthreads Release, same defines, `-s EXPORT_ES6=1 -s MAXIMUM_MEMORY=1610612736`, and the upstream `LINK_THREADS` `PTHREAD_POOL_SIZE` reduced from 32 to 8 (documented in the build script). `ALLOW_MEMORY_GROWTH=1` retained.
- `basis_encoder_threads.wasm` SHA-256: `d95fcbf8c1ed4016139af5afca099767a843c1b489b358bfbc33717cc1f110eb`

These builds are redistributions of the upstream binary; the ktx2-encoder project does not modify the Basis Universal source (only the documented emcc/link tunables above).

### Components within the Basis Universal build

The Apache-2.0 encoder library additionally links these third-party components:

- **Zstandard** — BSD-3-Clause, © Meta Platforms, Inc. (KTX2 supercompression)
- **tinyexr / tiny_dds / QOI loaders** — MIT

See the upstream [LICENSES folder](https://github.com/BinomialLLC/basis_universal/tree/master/LICENSES) for the full text of each.
