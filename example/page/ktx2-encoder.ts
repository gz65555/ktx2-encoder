import { WorkerPool } from "./WorkerPool";

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
}

class KTX2Encoder {
  private encoderWorkerPool: WorkerPool;
  private initPromise: Promise<any>;

  constructor() {
    this.encoderWorkerPool = new WorkerPool(4, async () => {
      const code = await fetch("/main.umd.js").then((res) => res.text());
      const blob = new Blob([code], { type: "application/javascript" });
      return new Worker(URL.createObjectURL(blob));
    });
    this.initPromise = this.encoderWorkerPool.prepareWorker();
  }

  encode(buffer: ArrayBuffer, options: Partial<IEncodeOptions>): Promise<Uint8Array> {
    return this.initPromise.then(() => {
      return this.encoderWorkerPool.postMessage({ buffer, options }).then((event) => {
        return event.data;
      });
    });
  }
}

export const ktx2Encoder = new KTX2Encoder();
