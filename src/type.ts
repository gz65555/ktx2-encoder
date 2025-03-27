import type { BasisTextureType, HDRSourceType, SourceType } from "./enum.js";

/**
 * which is defined in [basis_wrappers.cpp](https://github.com/BinomialLLC/basis_universal/blob/df079eca71cf83481c45059dce2165348dc1a5ea/webgl/transcoder/basis_wrappers.cpp#L1830)
 */
export interface IBasisEncoder {
  /**
   * Sets the slice's source image, either from a PNG file or from a raw 32-bit RGBA raster image.
   * The first texel is the top-left texel. The texel byte order in memory is R,G,B,A (R first at offset 0, A last at offset 3).
   * @param sliceIndex sliceIndex is the slice to change. Valid range is [0,BASISU_MAX_SLICES-1].
   * @param imageBuffer png image buffer or 32bit RGBA raster image buffer
   * @param width if isPNG is true, width set 0.
   * @param height if isPNG is true, height set 0.
   * @param type type of the input source.
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
  encode(pngBuffer: Uint8Array): number;
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
   * @param level Range is [1, 255]
   */
  setQualityLevel(level: number): void;
  /**
   * The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.
   * @param level Default is 2, range is [0, 6]
   */
  setCompressionLevel(level: number): void;
  /**
   * setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.
   */
  setNormalMap(): void;
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

  /** If true, the RDO post-processor will be applied to the encoded UASTC texture data. */
  setRDOUASTC(rdoUASTC: boolean): void;

  // Default is 1.0 range is [0.001, 10.0]
  setRDOUASTCQualityScalar(rdo_quality: number): void;

  /**  Default is 4096, range is [64, 65535] */
  setRDOUASTCDictSize(dictSize: number): void;

  /** Default is 10.0f, range is [01, 100.0] */
  setRDOUASTCMaxAllowedRMSIncreaseRatio(rdo_uastc_max_allowed_rms_increase_ratio: number): void;

  /** Default is 8.0f, range is [.01f, 100.0f] */
  setRDOUASTCSkipBlockRMSThresh(rdo_uastc_skip_block_rms_thresh: number): void;

  /**
   * Sets the max # of endpoint clusters for ETC1S mode. Use instead of setQualityLevel.
   * Default is 512, range is [1, 16128]
   */
  setMaxEndpointClusters(max_endpoint_clusters: number): void;

  /**
   * Sets the max # of selectors clusters for ETC1S mode. Use instead of setQualityLevel.
   * Default is 512, range is [1, 16128]
   */
  setMaxSelectorClusters(max_selector_clusters: number): void;

  /** Default is BASISU_DEFAULT_SELECTOR_RDO_THRESH, range is [0,1e+10] */
  setSelectorRDOThresh(selector_rdo_thresh: number): void;

  /** Default is BASISU_DEFAULT_ENDPOINT_RDO_THRESH, range is [0,1e+10] */
  setEndpointRDOThresh(endpoint_rdo_thresh: number): void;

  /**
   * Sets the UASTC(LDR) encoding performance vs. quality tradeoff, and other lesser used UASTC encoder flags.
   * @param - packUastcFlags 0-4, default is 1, the value is higher, the UASTC's quality is higher
   */
  setPackUASTCFlags(packUastcFlags: number): void;

  /**
   * Enable HDR mode. Only supported for UASTC encoding.
   * @param enableHDR Whether to enable HDR encoding mode
   */
  setHDR(enableHDR: boolean): void;

  /**
   * Sets the quality vs. encoder performance tradeoff (0-4, default is 1). Higher=slower but better quality.
   * @param level - Quality level(0-4), default is 1
   */
  setUASTCHDRQualityLevel(level: number): void;

  /**
   * setSliceSourceImageHDR is the same as setSliceSourceImage, but for HDR images.
   * If the input is a raster image, the buffer must be width*height*4 bytes in size. The raster image is stored in top down scanline order.
   * @param sliceIndex - sliceIndex is the slice to change. Valid range is [0,BASISU_MAX_SLICES-1].
   * @param imageBuffer - png image buffer or 32bit RGBA raster image buffer
   * @param width - if it is not raster image, width set 0.
   * @param height - if it is not raster image, height set 0.
   * @param type - type of the input source.
   * @param ldrSrgbToLinear - If true, the input is assumed to be in sRGB space.
   */
  setSliceSourceImageHDR(
    sliceIndex: number,
    imageBuffer: Uint8Array,
    width: number,
    height: number,
    type: HDRSourceType,
    ldrSrgbToLinear: boolean
  ): void;

  new (): IBasisEncoder;
}

export interface IBasisModule {
  BasisEncoder: IBasisEncoder;
  initializeBasis: () => void;
}

interface HDROptions extends BasisOptions {
  /**
   * Enable HDR mode. Only supported for UASTC encoding.
   */
  isHDR: true;
  /**
   * Image type
   */
  imageType: "hdr" | "exr" | "raster";
  /**
   * HDR quality level
   */
  hdrQualityLevel?: number;
}
interface LDROptions extends BasisOptions {
  /**
   * Enable HDR mode. Only supported for UASTC encoding.
   * Default is false.
   */
  isHDR?: false;
}

interface BasisOptions {
  /**
   *  enable debug output, default is false
   */
  enableDebug?: boolean;
  /**
   * is UASTC texture, default is true
   */
  isUASTC?: boolean;
  /**
   * if true the source images will be Y flipped before compression, default is false
   */
  isYFlip?: boolean;
  /**
   * Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.
   */
  qualityLevel?: number;
  /**
   * The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.
   */
  compressionLevel?: number;
  /**
   * Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE.
   */
  needSupercompression?: boolean;
  /**
   * uastcLDRQualityLevel 0-3, default is 1, the value is higher, the UASTC's quality is higher.
   */
  uastcLDRQualityLevel?: number;
  /**
   * enableRDO(UASTC LDR), default is false.
   */
  enableRDO?: boolean;
  /**
   * RDO quality level, 0 - 10 float number, default is 1.0.
   */
  rdoQualityLevel?: number;
  /**
   * setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.
   */
  isNormalMap?: boolean;

  /**
   * If true, the input is assumed to be in sRGB space. Be sure to set this correctly! (Examples: True on photos, albedo/spec maps, and false on normal maps.)
   */
  isPerceptual?: boolean;
  /**
   * Input source is sRGB. This should very probably match the "perceptual" setting.
   */
  isSetKTX2SRGBTransferFunc?: boolean;
  /**
   * If true mipmaps will be generated from the source images
   */
  generateMipmap?: boolean;
  /**
   * Create .KTX2 files instead of .basis files. By default this is FALSE.
   */
  isKTX2File?: boolean;

  /** kv data */
  kvData?: Record<string, string | Uint8Array>;

  /** type */
  type?: SourceType;
  /**
   * Decode compressed image buffer to RGBA imageData.(Required in Node.js)
   * @param buffer
   * @returns
   */
  imageDecoder?: (buffer: Uint8Array) => Promise<{ width: number; height: number; data: Uint8Array }>;
  /**
   * js url
   */
  jsUrl?: string;
  /**
   * wasm url
   */
  wasmUrl?: string;
}

export type IEncodeOptions = HDROptions | LDROptions;
