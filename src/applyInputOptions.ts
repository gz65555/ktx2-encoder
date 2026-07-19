import { IEncodeOptions, IBasisEncoder } from "./type.js";
import { DefaultOptions } from "./utils.js";

export function applyInputOptions(options: Partial<IEncodeOptions> = {}, encoder: IBasisEncoder) {
  options = { ...DefaultOptions, ...options };
  // basic
  if (options.enableDebug !== undefined) encoder.setDebug(options.enableDebug);
  if (options.isUASTC !== undefined) encoder.setUASTC(options.isUASTC);
  if (options.isKTX2File !== undefined) encoder.setCreateKTX2File(options.isKTX2File);
  // extra
  // The following three setters were renamed in Basis Universal v2.5. Prefer the
  // new name and fall back to the legacy one so the same code works against both
  // WASM generations, e.g. a custom wasmUrl pointing at an older build
  // (WASM_UPDATE_PLAN §5.2).
  if (options.isSetKTX2SRGBTransferFunc !== undefined) {
    if (encoder.setKTX2AndBasisSRGBTransferFunc)
      encoder.setKTX2AndBasisSRGBTransferFunc(options.isSetKTX2SRGBTransferFunc);
    else encoder.setKTX2SRGBTransferFunc(options.isSetKTX2SRGBTransferFunc);
  }
  if (options.generateMipmap !== undefined) encoder.setMipGen(options.generateMipmap);
  if (options.isYFlip !== undefined) encoder.setYFlip(options.isYFlip);
  if (options.isNormalMap) {
    if (encoder.setNormalMapPreset) encoder.setNormalMapPreset();
    else encoder.setNormalMap();
  }
  // etc1s
  if (options.qualityLevel !== undefined) encoder.setQualityLevel(options.qualityLevel);
  if (options.compressionLevel !== undefined) {
    if (encoder.setETC1SCompressionLevel) encoder.setETC1SCompressionLevel(options.compressionLevel);
    else encoder.setCompressionLevel(options.compressionLevel);
  }
  // uastc
  if (options.needSupercompression !== undefined) encoder.setKTX2UASTCSupercompression(options.needSupercompression);
  if (options.enableRDO) encoder.setRDOUASTC(true);
  if (options.rdoQualityLevel !== undefined) encoder.setRDOUASTCQualityScalar(options.rdoQualityLevel);
  if (options.uastcLDRQualityLevel !== undefined) encoder.setPackUASTCFlags(options.uastcLDRQualityLevel);
  // hdr, only set HDR, if hdr is true, otherwise the format mode will be etc1s
  /** see {@link https://github.com/BinomialLLC/basis_universal/blob/1172d07395a890c782c4f2ef09d2f08606c3f743/webgl/transcoder/basis_wrappers.cpp#L2307-L2321} */
  if (options.isHDR) {
    encoder.setHDR(options.isHDR);
    if (options.hdrQualityLevel !== undefined) encoder.setUASTCHDRQualityLevel(options.hdrQualityLevel);
  }
  if (options.isPerceptual !== undefined) encoder.setPerceptual(options.isPerceptual);
}
