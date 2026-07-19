#!/usr/bin/env bash
#
# Phase 1/3 (WASM_UPDATE_PLAN §7): reproducible build of the Basis Universal
# encoder WASM/JS glue that ktx2-encoder bundles.
#
# This script does NOT run in CI. It is the recorded, repeatable procedure for
# regenerating basis_encoder.{js,wasm} from a pinned upstream commit and syncing
# every tracked copy in the repo.
#
# Prerequisites:
#   - Emscripten SDK 4.0.15 active in the shell (emcmake / emcc on PATH).
#   - cmake, git.
#   - BASIS_UNIVERSAL_DIR pointing at a checkout of BinomialLLC/basis_universal.
#
# Usage:
#   BASIS_UNIVERSAL_DIR=/path/to/basis_universal ./scripts/build-basis-wasm.sh
#
# Verified build facts (webgl/encoder/CMakeLists.txt @ pinned commit):
#   - Base wasm32 target is `basis_encoder.js` (threads OFF, wasm64 OFF).
#   - LINK_BASE sets ALLOW_MEMORY_GROWTH=1, INITIAL_MEMORY=134217728 (128 MiB),
#     STACK_SIZE=2097152, MODULARIZE=1, EXPORT_NAME=BASIS,
#     EXPORTED_RUNTIME_METHODS=['HEAP8']; KTX2_ZSTANDARD ON, SUPPORT_ASTCENC OFF.
#   - We add `-s EXPORT_ES6=1` (via CMAKE_EXE_LINKER_FLAGS). VERIFIED: this emits
#     a native ES module that default-exports the `BASIS` factory and handles
#     node/web/worker with the node `createRequire` shim INSIDE the async
#     factory (no top-level await). No post-processing is needed; it drops in as
#     src/basis/basis_encoder.js and loads in node, Vite/Chromium, and workers.

set -euo pipefail

# ---------------------------------------------------------------------------
# Pinned inputs
# ---------------------------------------------------------------------------
PINNED_COMMIT="1b33fd5098c6e7b58324146b8f5518cbb4cdfb72"
EXPECTED_EMSDK_VERSION="4.0.15"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Every tracked copy of the WASM/JS that must stay byte-identical (§3).
DEST_DIRS=(
  "${REPO_ROOT}/src/basis"          # bundled with the npm package
  "${REPO_ROOT}/public"             # served to the browser test suite (wasm only)
  "${REPO_ROOT}/website/public/basis" # docs build copy
)

# ---------------------------------------------------------------------------
# Build-time decision still pending measurement (WASM_UPDATE_PLAN §6.6):
# a hard MAXIMUM_MEMORY backstop. Left unset for now — the JS-side v2.5 texel
# guard (encodeCore.ts) already bounds input to ~12 Mpix. Set a value (bytes)
# to add the cap once a peak-memory profile of the built module confirms it.
# ---------------------------------------------------------------------------
MAXIMUM_MEMORY="${KTX2_MAXIMUM_MEMORY:-0}"

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------
if [[ -z "${BASIS_UNIVERSAL_DIR:-}" ]]; then
  echo "ERROR: set BASIS_UNIVERSAL_DIR to a basis_universal checkout." >&2
  exit 1
fi
if ! command -v emcmake >/dev/null 2>&1; then
  echo "ERROR: emcmake not found. Activate the Emscripten SDK (${EXPECTED_EMSDK_VERSION})." >&2
  exit 1
fi

UPSTREAM_HEAD="$(git -C "${BASIS_UNIVERSAL_DIR}" rev-parse HEAD)"
if [[ "${UPSTREAM_HEAD}" != "${PINNED_COMMIT}" ]]; then
  echo "ERROR: ${BASIS_UNIVERSAL_DIR} is at ${UPSTREAM_HEAD}," >&2
  echo "       expected pinned commit ${PINNED_COMMIT}." >&2
  exit 1
fi

ACTUAL_EMSDK_VERSION="$(emcc --version | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1 || true)"
if [[ "${ACTUAL_EMSDK_VERSION}" != "${EXPECTED_EMSDK_VERSION}" ]]; then
  echo "WARNING: emcc version ${ACTUAL_EMSDK_VERSION} != pinned ${EXPECTED_EMSDK_VERSION}." >&2
  echo "         Reproducibility is only guaranteed on the pinned toolchain." >&2
fi

# Never reuse the stale untracked artifacts under webgl/encoder (see plan §1).
BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ktx2-basis-build.XXXXXX")"
echo "Building in clean dir: ${BUILD_DIR}"

# Optimize for size (-Os). The upstream CMakeLists hardcodes -O3 (speed) for
# Release, which cannot be overridden via CMAKE_CXX_FLAGS (target_compile_options
# wins). So patch -O3 -> -Os in place and restore on exit. Measured: -Os cuts
# the gzipped WASM ~18% for only ~11-29% slower encoding (output bytes and SSIM
# are unchanged — optimization level does not affect the encoder's math). -Oz
# would cut ~28% but at +66-80% encode time, losing the v2.5 speed win.
CMAKE_FILE="${BASIS_UNIVERSAL_DIR}/webgl/encoder/CMakeLists.txt"
cp "${CMAKE_FILE}" "${CMAKE_FILE}.ktx2bak"
# Restore the upstream file and clean the build dir no matter how we exit.
trap 'rm -rf "${BUILD_DIR}"; mv -f "${CMAKE_FILE}.ktx2bak" "${CMAKE_FILE}" 2>/dev/null || true' EXIT
sed 's/-O3/-Os/g' "${CMAKE_FILE}.ktx2bak" > "${CMAKE_FILE}"

# Deterministic timestamps in the output.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$(git -C "${BASIS_UNIVERSAL_DIR}" show -s --format=%ct "${PINNED_COMMIT}")}"

LINKER_FLAGS="-s EXPORT_ES6=1"
if [[ "${MAXIMUM_MEMORY}" != "0" ]]; then
  LINKER_FLAGS+=" -s MAXIMUM_MEMORY=${MAXIMUM_MEMORY}"
fi

# ---------------------------------------------------------------------------
# Configure + build ONLY the wasm32 base target.
# ---------------------------------------------------------------------------
emcmake cmake -S "${BASIS_UNIVERSAL_DIR}/webgl/encoder" -B "${BUILD_DIR}" \
  -DCMAKE_BUILD_TYPE=Release \
  -DKTX2_ZSTANDARD=ON \
  -DSUPPORT_ASTCENC=OFF \
  -DCMAKE_EXE_LINKER_FLAGS="${LINKER_FLAGS}"

cmake --build "${BUILD_DIR}" --target basis_encoder.js -j"$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)"

OUT_JS="${BUILD_DIR}/basis_encoder.js"
OUT_WASM="${BUILD_DIR}/basis_encoder.wasm"
for f in "${OUT_JS}" "${OUT_WASM}"; do
  [[ -f "$f" ]] || { echo "ERROR: expected build output missing: $f" >&2; exit 1; }
done

# ---------------------------------------------------------------------------
# Sync every tracked copy so no version-inconsistent JS/WASM combo exists.
# (public/ only needs the .wasm; the browser tests load the bundled glue.)
# ---------------------------------------------------------------------------
cp "${OUT_JS}" "${OUT_WASM}" "${REPO_ROOT}/src/basis/"
cp "${OUT_WASM}" "${REPO_ROOT}/public/basis_encoder.wasm"
cp "${OUT_JS}" "${OUT_WASM}" "${REPO_ROOT}/website/public/basis/"

# ---------------------------------------------------------------------------
# Provenance record.
# ---------------------------------------------------------------------------
sha256() { command -v sha256sum >/dev/null 2>&1 && sha256sum "$1" || shasum -a 256 "$1"; }
echo ""
echo "=== build provenance ==="
echo "upstream_commit  : ${PINNED_COMMIT}"
echo "emsdk_version    : ${ACTUAL_EMSDK_VERSION} (pinned ${EXPECTED_EMSDK_VERSION})"
echo "source_date_epoch: ${SOURCE_DATE_EPOCH}"
echo "optimization     : -Os (size), patched from upstream -O3"
echo "linker_flags     : ${LINKER_FLAGS}"
echo "js  sha256/size  : $(sha256 "${OUT_JS}"  | awk '{print $1}')  $(wc -c < "${OUT_JS}") bytes"
echo "wasm sha256/size : $(sha256 "${OUT_WASM}" | awk '{print $1}')  $(wc -c < "${OUT_WASM}") bytes"
echo "Synced to: src/basis, public, website/public/basis"
