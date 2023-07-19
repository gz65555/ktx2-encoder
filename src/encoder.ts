import { BasisTextureType, IBasisEncoder, SourceType } from "./IBasisEncoder";
import { IBasisModule } from "./IBasisModule";
import { write, read } from "ktx-parse";

declare function importScripts(...args: any): any;

export interface IEncodeOptions {
  /**
   *  enable debug output, default is false
   */
  enableDebug: boolean;
  /**
   * is UASTC texture, default is true
   */
  isUASTC: boolean;
  /**
   * if true the source images will be Y flipped before compression, default is false
   */
  isYFlip: boolean;
  /**
   * Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.
   */
  qualityLevel: number;
  /**
   * The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.
   */
  compressionLevel: number;
  /**
   * Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE
   */
  needSupercompression: boolean;
  /**
   * setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.
   */
  isNormalMap: boolean;
  /**
   * Input source is sRGB. This should very probably match the "perceptual" setting.
   */
  isSetKTX2SRGBTransferFunc: boolean;
  /**
   * If true mipmaps will be generated from the source images
   */
  generateMipmap: boolean;
  /**
   * Create .KTX2 files instead of .basis files. By default this is FALSE.
   */
  isKTX2File: boolean;

  /** kv data */
  kvData: Record<string, string | Uint8Array>;

  /** type */
  type: SourceType;
}

export const DefaultOptions = {
  enableDebug: false,
  isUASTC: true,
  isKTX2File: true,
  isInputSRGB: true,
  generateMipmap: true,
  needSupercompression: true,
  isSetKTX2SRGBTransferFunc: true
};

let encoder: IBasisEncoder | undefined;
const canvas = new OffscreenCanvas(128, 128);
const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
const isInWorker = typeof document === "undefined";

export function decodeImageData(imageBitmapSource: ImageBitmapSource) {
  return createImageBitmap(imageBitmapSource).then((bitmap) => {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    return imageData;
  });
}

export function encodeImageToKTX2(buffer: ArrayBuffer, options: Partial<IEncodeOptions> = {}) {
  return initBasis().then((basisModule) => {
    const encoder = new basisModule.BasisEncoder();
    applyInputOptions(options, encoder);
    encoder.setTexType(BasisTextureType.cBASISTexType2D);

    encoder.setSliceSourceImage(0, new Uint8Array(buffer), 0, 0, options.type ?? SourceType.PNG);

    const ktx2FileData = new Uint8Array(1024 * 1024 * 10);
    const byteLength = encoder.encode(ktx2FileData);
    if (byteLength === 0) {
      throw "encode failed";
    }
    let actualKTX2FileData = new Uint8Array(ktx2FileData.buffer, 0, byteLength);
    const container = read(ktx2FileData);
    if (options.kvData) {
      for (let k in options.kvData) {
        container.keyValue[k] = options.kvData[k];
      }
      actualKTX2FileData = write(container, { keepWriter: true });
    }
    encoder.delete();
    return actualKTX2FileData;
  });
}

export function encodeToKTX2(
  imageBitmapSource: ImageBitmapSource | ArrayBuffer,
  options: Partial<IEncodeOptions> = {}
): Promise<Uint8Array> {
  return initBasis().then((basisModule) => {
    const encoder = new basisModule.BasisEncoder();
    applyInputOptions(options, encoder);
    encoder.setTexType(BasisTextureType.cBASISTexType2D);

    if (imageBitmapSource instanceof ArrayBuffer) {
      imageBitmapSource = new Blob([imageBitmapSource]);
    }

    return decodeImageData(imageBitmapSource).then((imageData) => {
      encoder.setSliceSourceImage(0, new Uint8Array(imageData.data), imageData.width, imageData.height, SourceType.RAW);

      const ktx2FileData = new Uint8Array(1024 * 1024 * 10);
      const byteLength = encoder!.encode(ktx2FileData);
      if (byteLength === 0) {
        throw "encode failed";
      }
      let actualKTX2FileData = new Uint8Array(ktx2FileData.buffer, 0, byteLength);
      const container = read(ktx2FileData);
      if (options.kvData) {
        for (let k in options.kvData) {
          container.keyValue[k] = options.kvData[k];
        }
        actualKTX2FileData = write(container, { keepWriter: true });
      }
      return actualKTX2FileData;
    });
  });
}

export function encodeKTX2Cube(
  pngBuffers: Array<ArrayBuffer>,
  options: Partial<IEncodeOptions> = {},
  keepEncoder: boolean = false
) {
  if (pngBuffers.length !== 6) {
    throw "cube texture must have 6 images";
  }
  return initBasis().then((basisModule) => {
    const ktx2FileData = new Uint8Array(1024 * 1024 * 10);
    const encoder = new basisModule.BasisEncoder();
    applyInputOptions(options, encoder);
    encoder.setTexType(BasisTextureType.cBASISTexType2D);
    for (let i = 0; i < 6; i++) {
      encoder.setSliceSourceImage(i, new Uint8Array(pngBuffers[i]), 0, 0, 1);
    }
    const byteLength = encoder.encode(ktx2FileData);
    if (byteLength === 0) {
      throw "encode failed";
    }
    let actualKTX2FileData = new Uint8Array(ktx2FileData.buffer, 0, byteLength);
    const container = read(ktx2FileData);
    if (options.kvData) {
      container.keyValue = options.kvData;
      actualKTX2FileData = write(container);
    }
    if (keepEncoder) encoder.delete();
    return actualKTX2FileData;
  });
}

export function destroyEncoder() {
  if (encoder) encoder.delete();
  promise = null;
}

export function applyInputOptions(options: Partial<IEncodeOptions> = {}, encoder: IBasisEncoder) {
  options = { ...DefaultOptions, ...options };
  options.enableDebug !== undefined && encoder.setDebug(options.enableDebug);
  options.isUASTC !== undefined && encoder.setUASTC(options.isUASTC);
  options.isKTX2File !== undefined && encoder.setCreateKTX2File(options.isKTX2File);
  options.isSetKTX2SRGBTransferFunc !== undefined && encoder.setKTX2SRGBTransferFunc(options.isSetKTX2SRGBTransferFunc);
  options.generateMipmap !== undefined && encoder.setMipGen(options.generateMipmap);
  options.isYFlip !== undefined && encoder.setYFlip(options.isYFlip);
  options.qualityLevel !== undefined && encoder.setQualityLevel(options.qualityLevel);
  options.compressionLevel !== undefined && encoder.setCompressionLevel(options.compressionLevel);
  options.needSupercompression !== undefined && encoder.setKTX2UASTCSupercompression(options.needSupercompression);
  options.isNormalMap !== undefined && encoder.setNormalMap(options.isNormalMap);
}

let promise: Promise<IBasisModule> | null = null;
function initBasis(): Promise<IBasisModule> {
  if (!promise) {
    function _init(): Promise<IBasisModule> {
      return new Promise((resolve, reject) => {
        if (!isInWorker) {
          Promise.all([
            fetch("https://mdn.alipayobjects.com/rms/afts/file/A*SrRkQarYYl4AAAAAAAAAAAAAARQnAQ/basis_encoder.js").then(
              (res) => res.text()
            ),
            fetch(
              "https://mdn.alipayobjects.com/rms/afts/file/A*qFWbTrA0hZYAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm"
            ).then((res) => res.arrayBuffer())
          ])
            .then(([basisEncoderCode, wasmBinary]) => {
              const script = document.createElement("script");
              script.onload = () => {
                const basisModule = {
                  wasmBinary
                };
                // @ts-ignore
                BASIS(basisModule)
                  .then((Module: any) => {
                    Module.initializeBasis();
                    resolve(Module);
                  })
                  .catch(reject);
              };
              script.src = URL.createObjectURL(new Blob([basisEncoderCode]));
              script.onerror = reject;
              document.body.appendChild(script);
            })
            .catch(reject);
        } else {
          importScripts(
            "https://mdn.alipayobjects.com/rms/afts/file/A*SrRkQarYYl4AAAAAAAAAAAAAARQnAQ/basis_encoder.js"
          );
          fetch("https://mdn.alipayobjects.com/rms/afts/file/A*qFWbTrA0hZYAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm")
            .then((res) => res.arrayBuffer())
            .then((wasmBinary) => {
              const basisModule = {
                wasmBinary
              };
              // @ts-ignore
              BASIS(basisModule)
                .then((Module: any) => {
                  Module.initializeBasis();
                  resolve(Module);
                })
                .catch(reject);
            })
            .catch(reject);
        }
      });
    }
    promise = _init();
  }
  return promise;
}

if (isInWorker) {
  self.addEventListener("message", (e: MessageEvent) => {
    encodeToKTX2(e.data)
      .then((result) => {
        self.postMessage(result);
      })
      .catch((e) => {
        self.postMessage({ error: e });
      });
  });
}
