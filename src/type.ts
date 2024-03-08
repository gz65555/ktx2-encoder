export const enum BasisTextureType {
  cBASISTexType2D,
  cBASISTexType2DArray,
  cBASISTexTypeCubemapArray,
  cBASISTexTypeVideoFrames,
  cBASISTexTypeVolume
}

/** image source type */
export const enum SourceType {
  RAW,
  PNG
}

export interface IBasisEncoder {
  /**
   * Sets the slice's source image, either from a PNG file or from a raw 32-bit RGBA raster image.
   * The first texel is the top-left texel. The texel byte order in memory is R,G,B,A (R first at offset 0, A last at offset 3).
   * @param sliceIndex sliceIndex is the slice to change. Valid range is [0,BASISU_MAX_SLICES-1].
   * @param imageBuffer png image buffer or 32bit RGBA raster image buffer
   * @param width if isPNG is true, width set 0.
   * @param height if isPNG is true, height set 0.
   * @param isPNG is png buffer
   */
  setSliceSourceImage(
    sliceIndex: number,
    imageBuffer: Uint8Array,
    width: number,
    height: number,
    type: SourceType
  ): void;
  /**
   * Compresses the provided source slice(s) to an output .basis file.
   * At the minimum, you must provided at least 1 source slice by calling setSliceSourceImage() before calling this method.
   * @param pngBuffer
   * @returns byte length of encoded data
   */
  encode(outputUint8Array: Uint8Array): number;
  /**
   * If true, the encoder will output a UASTC texture, otherwise a ETC1S texture.
   * @param isUASTC
   */
  setUASTC(isUASTC: boolean): void;
  /**
   * Sets the basis texture type, default is cBASISTexType2D
   * @param texType texType is enum BasisTextureType
   */
  setTexType(texType: BasisTextureType): void;
  /**
   * Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE
   */
  setKTX2UASTCSupercompression(needSupercompression: boolean): void;
  /**
   * If true the source images will be Y flipped before compression.
   */
  setYFlip(isYFlip: boolean): void;
  /**
   * Enables debug output	to stdout
   * @param isDebug
   */
  setDebug(isDebug: boolean): void;
  /**
   * Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.
   * Default is -1 (meaning unused - the compressor will use m_max_endpoint_clusters/m_max_selector_clusters instead to control the codebook sizes).
   * @param level Range is [1,BASISU_QUALITY_MAX]
   */
  setQualityLevel(level: number): void;
  /**
   * The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.
   * @param level Default is BASISU_DEFAULT_COMPRESSION_LEVEL, range is [0,BASISU_MAX_COMPRESSION_LEVEL]
   */
  setCompressionLevel(level: number): void;
  /**
   * setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.
   * @param isNormalMap
   */
  setNormalMap(isNormalMap: boolean): void;
  /**
   * Create .KTX2 files instead of .basis files. By default this is FALSE.
   * @param isKTX2
   */
  setCreateKTX2File(isKTX2: boolean): void;
  /**
   * If true mipmaps will be generated from the source images
   * @param needGenMipmap
   */
  setMipGen(needGenMipmap: boolean): void;
  /**
   * Use sRGB transfer func in the file's DFD. Default is FALSE. This should very probably match the "perceptual" setting.
   * @param srgbTransferFunc need sRGB transfer func
   */
  setKTX2SRGBTransferFunc(srgbTransferFunc: boolean): void;
  /**
   * If true, the input is assumed to be in sRGB space. Be sure to set this correctly! (Examples: True on photos, albedo/spec maps, and false on normal maps.)
   */
  setPerceptual(perceptual: boolean): void;

  /** release memory */
  delete(): void;

  new (): IBasisEncoder;
}

export interface IBasisModule {
  BasisEncoder: IBasisEncoder;
  initializeBasis: () => void;
}

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
  /**
   * Decode compressed image buffer to RGBA imageData.(Required in Node.js)
   * @param buffer 
   * @returns 
   */
  imageDecoder?: (buffer: Uint8Array) => Promise<{ width: number; height: number; data: Uint8Array }>;
}
