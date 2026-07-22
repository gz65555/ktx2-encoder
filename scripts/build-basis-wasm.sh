#!/usr/bin/env bash
#
# Phase 1/3 (WASM_UPDATE_PLAN §7): reproducible build of the Basis Universal
# encoder WASM/JS glue that ktx2-encoder bundles.
#
# This script does NOT run in CI. It is the recorded, repeatable procedure for
# regenerating basis_encoder.{js,wasm} from a pinned upstream commit and syncing
# every tracked copy in the repo.
#
# It builds TWO variants from the same pinned source (WASM_THREADS_PLAN.md):
#   1. single-threaded  -> src/basis/           (the default, always loaded)
#   2. multithreaded     -> src/basis-threads/   (opt-in, loaded only when the
#                                                 page is cross-origin isolated)
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
#   - Base wasm32 single-threaded target is `basis_encoder.js` (threads OFF).
#   - Threaded wasm32 target is `basis_encoder_threads.js`, which adds
#     `-s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=32 -s ENVIRONMENT=web,worker`
#     and self-spawns module workers via
#     `new Worker(new URL("basis_encoder_threads.js", import.meta.url), {type:"module"})`.
#   - LINK_BASE sets ALLOW_MEMORY_GROWTH=1, INITIAL_MEMORY=134217728 (128 MiB),
#     STACK_SIZE=2097152, MODULARIZE=1, EXPORT_NAME=BASIS,
#     EXPORTED_RUNTIME_METHODS=['HEAP8']; KTX2_ZSTANDARD ON, SUPPORT_ASTCENC OFF.
#   - We add `-s EXPORT_ES6=1` (via CMAKE_EXE_LINKER_FLAGS). VERIFIED: this emits
#     a native ES module that default-exports the `BASIS` factory and handles
#     node/web/worker with the node `createRequire` shim INSIDE the async
#     factory (no top-level await). No post-processing is needed; it drops in as
#     src/basis/basis_encoder.js and loads in node, Vite/Chromium, and workers.
#
# Verified threaded-build facts (Phase 0/1 measurements, WASM_THREADS_PLAN §3b):
#   - Threaded ABI is byte-identical to the single-threaded embind surface, so
#     the JS compat layer is shared. `controlThreading()` exists in BOTH builds
#     (a no-op in the single-threaded one).
#   - `-s PTHREAD_POOL_SIZE=8` appended via CMAKE_EXE_LINKER_FLAGS does NOT win:
#     that flag sits BEFORE the target's own LINK_FLAGS in the emcc link line, so
#     the target's baked-in `=32` wins on conflict. We therefore PATCH the
#     CMakeLists LINK_THREADS line (32 -> 8) for the threaded build and restore
#     it afterwards. (A pre-spawned pool of 32 workers is far too heavy for a web
#     library; 8 matches the JS-side numThreads clamp.)
#   - `-s MAXIMUM_MEMORY=<bytes>` DOES apply when appended (it is additive, not a
#     conflict). Shared memory requires a declared maximum. Measured threaded
#     peak near the 12 Mpix source cap is ~752 MiB, so 1.5 GiB is comfortable.
#   - ALLOW_MEMORY_GROWTH is kept ON: a fixed (non-growable) shared memory gave
#     identical speed but reserved the full 1.5 GiB on every init.

set -euo pipefail

# ---------------------------------------------------------------------------
# Pinned inputs
# ---------------------------------------------------------------------------
PINNED_COMMIT="1b33fd5098c6e7b58324146b8f5518cbb4cdfb72"
EXPECTED_EMSDK_VERSION="4.0.15"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Threaded-build tunables (WASM_THREADS_PLAN §3 D3/D4).
THREADS_POOL_SIZE="${KTX2_THREADS_POOL_SIZE:-8}"
THREADS_MAXIMUM_MEMORY="${KTX2_THREADS_MAXIMUM_MEMORY:-1610612736}" # 1.5 GiB

# Every tracked copy that must stay in sync (§3).
SINGLE_DEST_DIRS=(
  "${REPO_ROOT}/src/basis"            # bundled with the npm package (default)
  "${REPO_ROOT}/website/public/basis" # docs build copy
)
THREADS_DEST_DIRS=(
  "${REPO_ROOT}/src/basis-threads"          # bundled with the npm package (opt-in)
  "${REPO_ROOT}/website/public/basis-threads" # docs build copy
)

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

CMAKELISTS="${BASIS_UNIVERSAL_DIR}/webgl/encoder/CMakeLists.txt"
if ! git -C "${BASIS_UNIVERSAL_DIR}" diff --quiet -- webgl/encoder/CMakeLists.txt; then
  echo "ERROR: ${CMAKELISTS} has uncommitted changes; refusing to patch on top." >&2
  echo "       Restore it (git checkout -- webgl/encoder/CMakeLists.txt) and retry." >&2
  exit 1
fi

ACTUAL_EMSDK_VERSION="$(emcc --version | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1 || true)"
if [[ "${ACTUAL_EMSDK_VERSION}" != "${EXPECTED_EMSDK_VERSION}" ]]; then
  echo "WARNING: emcc version ${ACTUAL_EMSDK_VERSION} != pinned ${EXPECTED_EMSDK_VERSION}." >&2
  echo "         Reproducibility is only guaranteed on the pinned toolchain." >&2
fi

# Deterministic timestamps in the output.
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$(git -C "${BASIS_UNIVERSAL_DIR}" show -s --format=%ct "${PINNED_COMMIT}")}"

sha256() { command -v sha256sum >/dev/null 2>&1 && sha256sum "$1" || shasum -a 256 "$1"; }

# ---------------------------------------------------------------------------
# Cleanup runs on EXIT (success or failure): restore the (possibly patched)
# CMakeLists and delete every temp build tree we created. build_variant runs in
# a process-substitution subshell, so build dirs are created + tracked here in
# the parent shell to keep BUILD_DIRS populated for cleanup. Provenance below is
# emitted before the script exits, i.e. before this trap fires.
BUILD_DIRS=()
cleanup() {
  git -C "${BASIS_UNIVERSAL_DIR}" checkout -- webgl/encoder/CMakeLists.txt 2>/dev/null || true
  # Guard the expansion: an empty array under `set -u` would otherwise error.
  if [[ ${#BUILD_DIRS[@]} -gt 0 ]]; then
    for d in "${BUILD_DIRS[@]}"; do
      [[ -n "$d" ]] && rm -rf "$d"
    done
  fi
}
trap cleanup EXIT

# build_variant <build_dir> <target> <out_basename> <extra_linker_flags>
#   Configures + builds one encoder target in the given (caller-tracked) temp dir
#   and echoes the two output paths ("<js> <wasm>") on stdout. All logging goes
#   to stderr.
# ---------------------------------------------------------------------------
build_variant() {
  local build_dir="$1" target="$2" out_basename="$3" extra_flags="$4"
  echo "Building ${target} in clean dir: ${build_dir}" >&2

  emcmake cmake -S "${BASIS_UNIVERSAL_DIR}/webgl/encoder" -B "${build_dir}" \
    -DCMAKE_BUILD_TYPE=Release \
    -DKTX2_ZSTANDARD=ON \
    -DSUPPORT_ASTCENC=OFF \
    -DCMAKE_EXE_LINKER_FLAGS="${extra_flags}" >&2

  cmake --build "${build_dir}" --target "${target}" \
    -j"$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)" >&2

  local out_js="${build_dir}/${out_basename}.js"
  local out_wasm="${build_dir}/${out_basename}.wasm"
  for f in "${out_js}" "${out_wasm}"; do
    [[ -f "$f" ]] || { echo "ERROR: expected build output missing: $f" >&2; exit 1; }
  done
  echo "${out_js} ${out_wasm}"
}

# ---------------------------------------------------------------------------
# 1. Single-threaded variant (unchanged flags — keeps the shipped artifact
#    byte-reproducible).
# ---------------------------------------------------------------------------
# Create + track the temp dir in the PARENT shell (build_variant runs in a
# process-substitution subshell, so it can't append to BUILD_DIRS itself).
SINGLE_BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ktx2-basis-build.XXXXXX")"
BUILD_DIRS+=("${SINGLE_BUILD_DIR}")
read -r SINGLE_JS SINGLE_WASM < <(build_variant "${SINGLE_BUILD_DIR}" "basis_encoder.js" "basis_encoder" "-s EXPORT_ES6=1")

for dir in "${SINGLE_DEST_DIRS[@]}"; do
  mkdir -p "$dir"
  cp "${SINGLE_JS}" "${SINGLE_WASM}" "$dir/"
done
# public/ only needs the wasm (the browser tests load the bundled glue).
cp "${SINGLE_WASM}" "${REPO_ROOT}/public/basis_encoder.wasm"

# ---------------------------------------------------------------------------
# 2. Threaded variant. Patch the pool size (see header); the EXIT trap restores
#    the CMakeLists no matter what.
# ---------------------------------------------------------------------------
# 32 -> THREADS_POOL_SIZE, only inside the LINK_THREADS definition.
perl -0pi -e "s/(-s PTHREAD_POOL_SIZE=)32\b/\${1}${THREADS_POOL_SIZE}/" "${CMAKELISTS}"
if ! grep -q -- "-s PTHREAD_POOL_SIZE=${THREADS_POOL_SIZE}" "${CMAKELISTS}"; then
  echo "ERROR: failed to patch PTHREAD_POOL_SIZE in ${CMAKELISTS}." >&2
  exit 1
fi
echo "Patched PTHREAD_POOL_SIZE -> ${THREADS_POOL_SIZE}" >&2

THREADS_BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ktx2-basis-build.XXXXXX")"
BUILD_DIRS+=("${THREADS_BUILD_DIR}")
read -r THREADS_JS THREADS_WASM < <(build_variant "${THREADS_BUILD_DIR}" "basis_encoder_threads.js" "basis_encoder_threads" \
  "-s EXPORT_ES6=1 -s MAXIMUM_MEMORY=${THREADS_MAXIMUM_MEMORY}")

for dir in "${THREADS_DEST_DIRS[@]}"; do
  mkdir -p "$dir"
  cp "${THREADS_JS}" "${THREADS_WASM}" "$dir/"
done
cp "${THREADS_WASM}" "${REPO_ROOT}/public/basis_encoder_threads.wasm"

# Restore the CMakeLists now that the threaded build consumed the patch (the EXIT
# trap also does this as a safety net).
git -C "${BASIS_UNIVERSAL_DIR}" checkout -- webgl/encoder/CMakeLists.txt

# ---------------------------------------------------------------------------
# Provenance record.
# ---------------------------------------------------------------------------
echo ""
echo "=== build provenance ==="
echo "upstream_commit  : ${PINNED_COMMIT}"
echo "emsdk_version    : ${ACTUAL_EMSDK_VERSION} (pinned ${EXPECTED_EMSDK_VERSION})"
echo "source_date_epoch: ${SOURCE_DATE_EPOCH}"
echo "-- single-threaded (src/basis) --"
echo "linker_flags     : -s EXPORT_ES6=1"
echo "js  sha256/size  : $(sha256 "${SINGLE_JS}"  | awk '{print $1}')  $(wc -c < "${SINGLE_JS}") bytes"
echo "wasm sha256/size : $(sha256 "${SINGLE_WASM}" | awk '{print $1}')  $(wc -c < "${SINGLE_WASM}") bytes"
echo "-- multithreaded (src/basis-threads) --"
echo "cmake_patch      : LINK_THREADS PTHREAD_POOL_SIZE=32 -> ${THREADS_POOL_SIZE}"
echo "linker_flags     : -s EXPORT_ES6=1 -s MAXIMUM_MEMORY=${THREADS_MAXIMUM_MEMORY}"
echo "js  sha256/size  : $(sha256 "${THREADS_JS}"  | awk '{print $1}')  $(wc -c < "${THREADS_JS}") bytes"
echo "wasm sha256/size : $(sha256 "${THREADS_WASM}" | awk '{print $1}')  $(wc -c < "${THREADS_WASM}") bytes"
echo ""
echo "Synced single -> src/basis, public (wasm), website/public/basis"
echo "Synced threads -> src/basis-threads, public (wasm), website/public/basis-threads"
