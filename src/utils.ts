import { IBasisEncoder, IEncodeOptions } from "./type.js";

export const DefaultOptions = {
  enableDebug: false,
  isUASTC: true,
  isKTX2File: true,
  isInputSRGB: true,
  generateMipmap: true,
  needSupercompression: true,
  isSetKTX2SRGBTransferFunc: true,
  isHDR: false,
  qualityLevel: 150
};

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
  // hdr
  options.isHDR !== undefined && encoder.setHDR(options.isHDR);
  if (options.isHDR) {
    options.hdrQualityLevel && encoder.setUASTCHDRQualityLevel(options.hdrQualityLevel);
  }
  options.isPerceptual !== undefined && encoder.setPerceptual(options.isPerceptual);
}
