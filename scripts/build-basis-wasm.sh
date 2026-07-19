#!/usr/bin/env bash
#
# Phase 1 (WASM_UPDATE_PLAN_V1_2.md §7): reproducible build of the Basis Universal
# encoder WASM/JS glue that ktx2-encoder bundles.
#
# This script does NOT run in CI. It is the recorded, repeatable procedure for
# regenerating src/basis/basis_encoder.{js,wasm} from a pinned upstream commit.
#
# Prerequisites:
#   - Emscripten SDK 4.0.15 active in the shell (emcmake / emcc on PATH).
#   - cmake, git.
#   - BASIS_UNIVERSAL_DIR pointing at a checkout of BinomialLLC/basis_universal.
#
# Usage:
#   BASIS_UNIVERSAL_DIR=/path/to/basis_universal ./scripts/build-basis-wasm.sh
#
# Verified build facts (from webgl/encoder/CMakeLists.txt @ pinned commit):
#   - Base wasm32 target is `basis_encoder.js` (threads OFF, wasm64 OFF).
#   - LINK_BASE already sets: ALLOW_MEMORY_GROWTH=1, INITIAL_MEMORY=134217728
#     (128 MiB), STACK_SIZE=2097152, MODULARIZE=1, EXPORT_NAME=BASIS,
#     EXPORTED_RUNTIME_METHODS=['HEAP8'].
#   - The base target does NOT set MAXIMUM_MEMORY or EXPORT_ES6.
#   - KTX2_ZSTANDARD defaults ON; SUPPORT_ASTCENC defaults OFF.

set -euo pipefail

# ---------------------------------------------------------------------------
# Pinned inputs
# ---------------------------------------------------------------------------
PINNED_COMMIT="1b33fd5098c6e7b58324146b8f5518cbb4cdfb72"
EXPECTED_EMSDK_VERSION="4.0.15"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${REPO_ROOT}/src/basis"

# ---------------------------------------------------------------------------
# Build-time decisions still pending Phase 0/1 measurement.
# WASM_UPDATE_PLAN_V1_2.md §6.5 (texel ceiling) and §6.6 (memory cap).
# These are DELIBERATELY placeholders; do not treat as final until the peak-
# memory stress test in Phase 1 has produced numbers. Tracked in
# IMPLEMENTATION_STATUS.md.
# ---------------------------------------------------------------------------
# Hard memory backstop (bytes). Upstream wasm32 target has no MAXIMUM_MEMORY.
# TODO(Phase 1): set from peak-memory stress test, with headroom. 0 = unset.
MAXIMUM_MEMORY="${KTX2_MAXIMUM_MEMORY:-0}"
# Raise the source-texel HIGHER_LIMIT? (§6.5 strategy B). The #define lives in
# basis_wrappers.cpp guarded by #ifdef __wasm64__; a plain -D is shadowed by the
# in-source #define, so strategy B requires patching the source, NOT a flag.
# TODO(Phase 0): decide strategy A (keep 12 Mpix) vs B (patch + raise), then
# implement the patch step here if B.
RAISE_TEXEL_LIMIT="${KTX2_RAISE_TEXEL_LIMIT:-0}"

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
trap 'rm -rf "${BUILD_DIR}"' EXIT

# Deterministic timestamps in the output.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$(git -C "${BASIS_UNIVERSAL_DIR}" show -s --format=%ct "${PINNED_COMMIT}")}"

# Append our extra link flags on top of the CMakeLists LINK_BASE via EMCC_CFLAGS.
EXTRA_LINK_FLAGS=""
if [[ "${MAXIMUM_MEMORY}" != "0" ]]; then
  EXTRA_LINK_FLAGS+=" -s MAXIMUM_MEMORY=${MAXIMUM_MEMORY}"
fi
# ESM: upstream base target is MODULARIZE (UMD-ish), but ktx2-encoder needs an
# ES module with `export default BASIS`. TODO(Phase 1): confirm whether
# `-s EXPORT_ES6=1` here yields a node+web+worker-loadable ESM that matches the
# current glue shape, or whether a deterministic post-transform is still needed.
# EXTRA_LINK_FLAGS+=" -s EXPORT_ES6=1"
export EMCC_CFLAGS="${EXTRA_LINK_FLAGS}"

# ---------------------------------------------------------------------------
# Configure + build ONLY the wasm32 base target.
# ---------------------------------------------------------------------------
emcmake cmake -S "${BASIS_UNIVERSAL_DIR}/webgl/encoder" -B "${BUILD_DIR}" \
  -DCMAKE_BUILD_TYPE=Release \
  -DKTX2_ZSTANDARD=ON \
  -DSUPPORT_ASTCENC=OFF

cmake --build "${BUILD_DIR}" --target basis_encoder.js -j"$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)"

OUT_JS="${BUILD_DIR}/basis_encoder.js"
OUT_WASM="${BUILD_DIR}/basis_encoder.wasm"
for f in "${OUT_JS}" "${OUT_WASM}"; do
  [[ -f "$f" ]] || { echo "ERROR: expected build output missing: $f" >&2; exit 1; }
done

# ---------------------------------------------------------------------------
# ESM post-transform placeholder.
# TODO(Phase 1): if EXPORT_ES6 is not used above, apply the deterministic
# transform that turns the MODULARIZE output into the `export default BASIS`
# ESM shape currently shipped in src/basis/basis_encoder.js (node createRequire
# preamble + default export). Keep it a scripted, reviewable step.
# ---------------------------------------------------------------------------

echo "NOTE: not copying to ${DEST_DIR} automatically — review the ESM shape first." >&2
echo "      Outputs left in ${BUILD_DIR} (dir is cleaned on exit; copy them out now if needed)."

# ---------------------------------------------------------------------------
# Provenance record.
# ---------------------------------------------------------------------------
echo ""
echo "=== build provenance ==="
echo "upstream_commit : ${PINNED_COMMIT}"
echo "emsdk_version   : ${ACTUAL_EMSDK_VERSION} (pinned ${EXPECTED_EMSDK_VERSION})"
echo "source_date_epoch: ${SOURCE_DATE_EPOCH}"
echo "extra_link_flags: ${EMCC_CFLAGS:-<none>}"
sha256() { command -v sha256sum >/dev/null 2>&1 && sha256sum "$1" || shasum -a 256 "$1"; }
echo "js  sha256/size : $(sha256 "${OUT_JS}"  | awk '{print $1}')  $(wc -c < "${OUT_JS}") bytes"
echo "wasm sha256/size: $(sha256 "${OUT_WASM}" | awk '{print $1}')  $(wc -c < "${OUT_WASM}") bytes"
