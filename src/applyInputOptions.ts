import { IEncodeOptions, IBasisEncoder } from "./type";
import { DefaultOptions } from "./utils";

export function applyInputOptions(options: Partial<IEncodeOptions> = {}, encoder: IBasisEncoder) {
  options = { ...DefaultOptions, ...options };
  // basic
  options.enableDebug !== undefined && encoder.setDebug(options.enableDebug);
  options.isUASTC !== undefined && encoder.setUASTC(options.isUASTC);
  options.isKTX2File !== undefined && encoder.setCreateKTX2File(options.isKTX2File);
  // extra
  options.isSetKTX2SRGBTransferFunc !== undefined && encoder.setKTX2SRGBTransferFunc(options.isSetKTX2SRGBTransferFunc);
  options.generateMipmap !== undefined && encoder.setMipGen(options.generateMipmap);
  options.isYFlip !== undefined && encoder.setYFlip(options.isYFlip);
  options.isNormalMap === true && encoder.setNormalMap();
  // etc1s
  options.qualityLevel !== undefined && encoder.setQualityLevel(options.qualityLevel);
  options.compressionLevel !== undefined && encoder.setCompressionLevel(options.compressionLevel);
  // uastc
  options.needSupercompression !== undefined && encoder.setKTX2UASTCSupercompression(options.needSupercompression);
  options.enableRDO && encoder.setRDOUASTC(true);
  options.rdoQualityLevel !== undefined && encoder.setRDOUASTCQualityScalar(options.rdoQualityLevel);
  options.uastcLDRQualityLevel !== undefined && encoder.setPackUASTCFlags(options.uastcLDRQualityLevel);
  // hdr, only set HDR, if hdr is true, otherwise the format mode will be etc1s
  /** see {@link https://github.com/BinomialLLC/basis_universal/blob/1172d07395a890c782c4f2ef09d2f08606c3f743/webgl/transcoder/basis_wrappers.cpp#L2307-L2321} */
  if (options.isHDR) {
    encoder.setHDR(options.isHDR);
    options.hdrQualityLevel && encoder.setUASTCHDRQualityLevel(options.hdrQualityLevel);
  }
  options.isPerceptual !== undefined && encoder.setPerceptual(options.isPerceptual);
  if(options.extraWorkerThreads !== undefined && options.extraWorkerThreads > 0) {
    console.log('numberThreads', options.extraWorkerThreads);
    encoder.controlThreading(true, options.extraWorkerThreads);
  }
}
