import { CubeBufferData, IBasisModule, IEncodeOptions } from "../type.js";
import { encodeWithModule } from "../encodeCore.js";
import BASIS from "../basis/basis_encoder.js";

const DEFAULT_WASM_URL = new URL("../basis/basis_encoder.wasm", import.meta.url).href;
const DEFAULT_THREADS_WASM_URL = new URL("../basis-threads/basis_encoder_threads.wasm", import.meta.url).href;

type BasisFactory = (moduleArg?: { wasmBinary?: ArrayBuffer }) => Promise<IBasisModule>;
type Variant = "single" | "threads";

interface VariantSlot {
  promise: Promise<IBasisModule> | null;
  wasmUrl: string | null;
}

/**
 * Lazily import the multithreaded glue so its ~3.3 MB payload never enters the
 * main bundle for consumers that don't opt into threading.
 */
function loadThreadsFactory(): Promise<BasisFactory> {
  return import("../basis-threads/basis_encoder_threads.js").then((m) => m.default as BasisFactory);
}

/**
 * WASM threads need `SharedArrayBuffer`, which browsers only expose to
 * cross-origin isolated pages (COOP `same-origin` + COEP `require-corp`).
 */
function threadsAvailable(): boolean {
  return typeof SharedArrayBuffer !== "undefined" && globalThis.crossOriginIsolated === true;
}

async function instantiate(factory: Promise<BasisFactory>, wasmUrl: string): Promise<IBasisModule> {
  const [wasmBinary, basis] = await Promise.all([fetchWasmBinary(wasmUrl), factory]);
  const module: IBasisModule = await basis({ wasmBinary });
  module.initializeBasis();
  return module;
}

// Each threaded module pre-spawns a worker pool and allocates shared WASM
// memory, so it is cached at MODULE scope, keyed by URL — every
// BrowserBasisEncoder shares one pool per URL instead of accumulating workers
// when an app creates several encoders. (The single-threaded module has no
// workers, so it stays a cheap per-instance cache and keeps its existing
// one-URL-per-instance semantics.)
const threadsModuleCache = new Map<string, Promise<IBasisModule>>();

function loadThreadsModule(wasmUrl: string): Promise<IBasisModule> {
  let promise = threadsModuleCache.get(wasmUrl);
  if (!promise) {
    promise = instantiate(loadThreadsFactory(), wasmUrl).catch((error: unknown) => {
      if (threadsModuleCache.get(wasmUrl) === promise) threadsModuleCache.delete(wasmUrl);
      throw error;
    });
    threadsModuleCache.set(wasmUrl, promise);
  }
  return promise;
}

/**
 * Fetches the WASM binary from the given URL. There is no CDN or other fallback:
 * only the version-matched, bundled asset is used by default, and an explicit
 * `wasmUrl` is fetched as-is. A failed request throws with the URL and status so
 * a stale or mismatched WASM never loads silently.
 */
export async function fetchWasmBinary(wasmUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(wasmUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch basis_encoder.wasm from ${wasmUrl}: ${response.status}`);
  }
  return response.arrayBuffer();
}

export class BrowserBasisEncoder {
  private single: VariantSlot = { promise: null, wasmUrl: null };
  private warnedThreadsFallback = false;

  init(options?: {
    jsUrl?: string;
    wasmUrl?: string;
    threadsWasmUrl?: string;
    useThreads?: boolean;
  }): Promise<IBasisModule> {
    if (options?.jsUrl) {
      console.warn("The jsUrl option is deprecated and ignored. The bundled Basis encoder module is always used.");
    }
    // The threaded and single builds use DIFFERENT WASM, so each has its own URL
    // option. Falling back to single (below) always uses the single-threaded URL
    // — never the threaded one — so single glue is never paired with threaded
    // WASM.
    if (this.resolveVariant(options) === "threads") {
      return loadThreadsModule(options?.threadsWasmUrl ?? DEFAULT_THREADS_WASM_URL);
    }
    return this.initSingle(options?.wasmUrl ?? DEFAULT_WASM_URL);
  }

  private resolveVariant(options?: { useThreads?: boolean }): Variant {
    if (!options?.useThreads) return "single";
    if (threadsAvailable()) return "threads";
    if (!this.warnedThreadsFallback) {
      console.warn(
        "[ktx2-encoder] useThreads was requested but this page is not cross-origin isolated " +
          "(crossOriginIsolated is false); serve it with COOP 'same-origin' + COEP 'require-corp' " +
          "to enable WASM threads. Falling back to the single-threaded encoder."
      );
      this.warnedThreadsFallback = true;
    }
    return "single";
  }

  private initSingle(requestedWasmUrl: string): Promise<IBasisModule> {
    const slot = this.single;
    if (slot.promise && requestedWasmUrl !== slot.wasmUrl) {
      console.warn(
        `[ktx2-encoder] init() is already using ${slot.wasmUrl}; ignoring different wasmUrl ${requestedWasmUrl}. ` +
          "Create a new BrowserBasisEncoder instance to use another URL."
      );
    }
    if (!slot.promise) {
      slot.wasmUrl = requestedWasmUrl;
      const modulePromise = instantiate(Promise.resolve(BASIS), requestedWasmUrl).catch((error: unknown) => {
        if (slot.promise === modulePromise) {
          slot.promise = null;
          slot.wasmUrl = null;
        }
        throw error;
      });
      slot.promise = modulePromise;
    }
    return slot.promise;
  }

  /**
   * encode image data to ktx2 file data
   * @param bufferOrBufferArray - image data, can be a single image or an array of images
   * if it's an array, the images will be encoded as a cube map, the order of the images is:
   *  0: Positive X face
   *  1: Negative X face
   *  2: Positive Y face
   *  3: Negative Y face
   *  4: Positive Z face
   *  5: Negative Z face
   * @param options - encode options, see {@link IEncodeOptions}
   * @returns ktx2 file data
   */
  async encode(
    bufferOrBufferArray: Uint8Array | CubeBufferData,
    options: Partial<IEncodeOptions> = {}
  ): Promise<Uint8Array> {
    return encodeWithModule(await this.init(options), bufferOrBufferArray, options);
  }
}

export const browserEncoder = new BrowserBasisEncoder();
