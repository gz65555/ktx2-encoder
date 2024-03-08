import { IBasisEncoder, IEncodeOptions } from "./type";

export const DefaultOptions = {
  enableDebug: false,
  isUASTC: true,
  isKTX2File: true,
  isInputSRGB: true,
  generateMipmap: true,
  needSupercompression: true,
  isSetKTX2SRGBTransferFunc: true,
  qualityLevel: 150
};

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
