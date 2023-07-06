// node_modules/.pnpm/ktx-parse@0.5.0/node_modules/ktx-parse/dist/ktx-parse.modern.js
var KHR_SUPERCOMPRESSION_NONE = 0;
var KHR_SUPERCOMPRESSION_BASISLZ = 1;
var KHR_SUPERCOMPRESSION_ZSTD = 2;
var KHR_SUPERCOMPRESSION_ZLIB = 3;
var KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT = 0;
var KHR_DF_VENDORID_KHRONOS = 0;
var KHR_DF_VERSION = 2;
var KHR_DF_MODEL_UNSPECIFIED = 0;
var KHR_DF_MODEL_RGBSDA = 1;
var KHR_DF_MODEL_ETC1 = 160;
var KHR_DF_MODEL_ETC2 = 161;
var KHR_DF_MODEL_ASTC = 162;
var KHR_DF_MODEL_ETC1S = 163;
var KHR_DF_MODEL_UASTC = 166;
var KHR_DF_FLAG_ALPHA_STRAIGHT = 0;
var KHR_DF_FLAG_ALPHA_PREMULTIPLIED = 1;
var KHR_DF_TRANSFER_UNSPECIFIED = 0;
var KHR_DF_TRANSFER_LINEAR = 1;
var KHR_DF_TRANSFER_SRGB = 2;
var KHR_DF_TRANSFER_ITU = 3;
var KHR_DF_TRANSFER_NTSC = 4;
var KHR_DF_TRANSFER_SLOG = 5;
var KHR_DF_TRANSFER_SLOG2 = 6;
var KHR_DF_TRANSFER_BT1886 = 7;
var KHR_DF_TRANSFER_HLG_OETF = 8;
var KHR_DF_TRANSFER_HLG_EOTF = 9;
var KHR_DF_TRANSFER_PQ_EOTF = 10;
var KHR_DF_TRANSFER_PQ_OETF = 11;
var KHR_DF_TRANSFER_DCIP3 = 12;
var KHR_DF_TRANSFER_PAL_OETF = 13;
var KHR_DF_TRANSFER_PAL625_EOTF = 14;
var KHR_DF_TRANSFER_ST240 = 15;
var KHR_DF_TRANSFER_ACESCC = 16;
var KHR_DF_TRANSFER_ACESCCT = 17;
var KHR_DF_TRANSFER_ADOBERGB = 18;
var KHR_DF_PRIMARIES_UNSPECIFIED = 0;
var KHR_DF_PRIMARIES_BT709 = 1;
var KHR_DF_PRIMARIES_BT601_EBU = 2;
var KHR_DF_PRIMARIES_BT601_SMPTE = 3;
var KHR_DF_PRIMARIES_BT2020 = 4;
var KHR_DF_PRIMARIES_CIEXYZ = 5;
var KHR_DF_PRIMARIES_ACES = 6;
var KHR_DF_PRIMARIES_ACESCC = 7;
var KHR_DF_PRIMARIES_NTSC1953 = 8;
var KHR_DF_PRIMARIES_PAL525 = 9;
var KHR_DF_PRIMARIES_DISPLAYP3 = 10;
var KHR_DF_PRIMARIES_ADOBERGB = 11;
var KHR_DF_CHANNEL_RGBSDA_RED = 0;
var KHR_DF_CHANNEL_RGBSDA_GREEN = 1;
var KHR_DF_CHANNEL_RGBSDA_BLUE = 2;
var KHR_DF_CHANNEL_RGBSDA_STENCIL = 13;
var KHR_DF_CHANNEL_RGBSDA_DEPTH = 14;
var KHR_DF_CHANNEL_RGBSDA_ALPHA = 15;
var KHR_DF_SAMPLE_DATATYPE_FLOAT = 128;
var KHR_DF_SAMPLE_DATATYPE_SIGNED = 64;
var KHR_DF_SAMPLE_DATATYPE_EXPONENT = 32;
var KHR_DF_SAMPLE_DATATYPE_LINEAR = 16;
var VK_FORMAT_UNDEFINED = 0;
var VK_FORMAT_R4G4_UNORM_PACK8 = 1;
var VK_FORMAT_R4G4B4A4_UNORM_PACK16 = 2;
var VK_FORMAT_B4G4R4A4_UNORM_PACK16 = 3;
var VK_FORMAT_R5G6B5_UNORM_PACK16 = 4;
var VK_FORMAT_B5G6R5_UNORM_PACK16 = 5;
var VK_FORMAT_R5G5B5A1_UNORM_PACK16 = 6;
var VK_FORMAT_B5G5R5A1_UNORM_PACK16 = 7;
var VK_FORMAT_A1R5G5B5_UNORM_PACK16 = 8;
var VK_FORMAT_R8_UNORM = 9;
var VK_FORMAT_R8_SNORM = 10;
var VK_FORMAT_R8_UINT = 13;
var VK_FORMAT_R8_SINT = 14;
var VK_FORMAT_R8_SRGB = 15;
var VK_FORMAT_R8G8_UNORM = 16;
var VK_FORMAT_R8G8_SNORM = 17;
var VK_FORMAT_R8G8_UINT = 20;
var VK_FORMAT_R8G8_SINT = 21;
var VK_FORMAT_R8G8_SRGB = 22;
var VK_FORMAT_R8G8B8_UNORM = 23;
var VK_FORMAT_R8G8B8_SNORM = 24;
var VK_FORMAT_R8G8B8_UINT = 27;
var VK_FORMAT_R8G8B8_SINT = 28;
var VK_FORMAT_R8G8B8_SRGB = 29;
var VK_FORMAT_B8G8R8_UNORM = 30;
var VK_FORMAT_B8G8R8_SNORM = 31;
var VK_FORMAT_B8G8R8_UINT = 34;
var VK_FORMAT_B8G8R8_SINT = 35;
var VK_FORMAT_B8G8R8_SRGB = 36;
var VK_FORMAT_R8G8B8A8_UNORM = 37;
var VK_FORMAT_R8G8B8A8_SNORM = 38;
var VK_FORMAT_R8G8B8A8_UINT = 41;
var VK_FORMAT_R8G8B8A8_SINT = 42;
var VK_FORMAT_R8G8B8A8_SRGB = 43;
var VK_FORMAT_B8G8R8A8_UNORM = 44;
var VK_FORMAT_B8G8R8A8_SNORM = 45;
var VK_FORMAT_B8G8R8A8_UINT = 48;
var VK_FORMAT_B8G8R8A8_SINT = 49;
var VK_FORMAT_B8G8R8A8_SRGB = 50;
var VK_FORMAT_A2R10G10B10_UNORM_PACK32 = 58;
var VK_FORMAT_A2R10G10B10_SNORM_PACK32 = 59;
var VK_FORMAT_A2R10G10B10_UINT_PACK32 = 62;
var VK_FORMAT_A2R10G10B10_SINT_PACK32 = 63;
var VK_FORMAT_A2B10G10R10_UNORM_PACK32 = 64;
var VK_FORMAT_A2B10G10R10_SNORM_PACK32 = 65;
var VK_FORMAT_A2B10G10R10_UINT_PACK32 = 68;
var VK_FORMAT_A2B10G10R10_SINT_PACK32 = 69;
var VK_FORMAT_R16_UNORM = 70;
var VK_FORMAT_R16_SNORM = 71;
var VK_FORMAT_R16_UINT = 74;
var VK_FORMAT_R16_SINT = 75;
var VK_FORMAT_R16_SFLOAT = 76;
var VK_FORMAT_R16G16_UNORM = 77;
var VK_FORMAT_R16G16_SNORM = 78;
var VK_FORMAT_R16G16_UINT = 81;
var VK_FORMAT_R16G16_SINT = 82;
var VK_FORMAT_R16G16_SFLOAT = 83;
var VK_FORMAT_R16G16B16_UNORM = 84;
var VK_FORMAT_R16G16B16_SNORM = 85;
var VK_FORMAT_R16G16B16_UINT = 88;
var VK_FORMAT_R16G16B16_SINT = 89;
var VK_FORMAT_R16G16B16_SFLOAT = 90;
var VK_FORMAT_R16G16B16A16_UNORM = 91;
var VK_FORMAT_R16G16B16A16_SNORM = 92;
var VK_FORMAT_R16G16B16A16_UINT = 95;
var VK_FORMAT_R16G16B16A16_SINT = 96;
var VK_FORMAT_R16G16B16A16_SFLOAT = 97;
var VK_FORMAT_R32_UINT = 98;
var VK_FORMAT_R32_SINT = 99;
var VK_FORMAT_R32_SFLOAT = 100;
var VK_FORMAT_R32G32_UINT = 101;
var VK_FORMAT_R32G32_SINT = 102;
var VK_FORMAT_R32G32_SFLOAT = 103;
var VK_FORMAT_R32G32B32_UINT = 104;
var VK_FORMAT_R32G32B32_SINT = 105;
var VK_FORMAT_R32G32B32_SFLOAT = 106;
var VK_FORMAT_R32G32B32A32_UINT = 107;
var VK_FORMAT_R32G32B32A32_SINT = 108;
var VK_FORMAT_R32G32B32A32_SFLOAT = 109;
var VK_FORMAT_R64_UINT = 110;
var VK_FORMAT_R64_SINT = 111;
var VK_FORMAT_R64_SFLOAT = 112;
var VK_FORMAT_R64G64_UINT = 113;
var VK_FORMAT_R64G64_SINT = 114;
var VK_FORMAT_R64G64_SFLOAT = 115;
var VK_FORMAT_R64G64B64_UINT = 116;
var VK_FORMAT_R64G64B64_SINT = 117;
var VK_FORMAT_R64G64B64_SFLOAT = 118;
var VK_FORMAT_R64G64B64A64_UINT = 119;
var VK_FORMAT_R64G64B64A64_SINT = 120;
var VK_FORMAT_R64G64B64A64_SFLOAT = 121;
var VK_FORMAT_B10G11R11_UFLOAT_PACK32 = 122;
var VK_FORMAT_E5B9G9R9_UFLOAT_PACK32 = 123;
var VK_FORMAT_D16_UNORM = 124;
var VK_FORMAT_X8_D24_UNORM_PACK32 = 125;
var VK_FORMAT_D32_SFLOAT = 126;
var VK_FORMAT_S8_UINT = 127;
var VK_FORMAT_D16_UNORM_S8_UINT = 128;
var VK_FORMAT_D24_UNORM_S8_UINT = 129;
var VK_FORMAT_D32_SFLOAT_S8_UINT = 130;
var VK_FORMAT_BC1_RGB_UNORM_BLOCK = 131;
var VK_FORMAT_BC1_RGB_SRGB_BLOCK = 132;
var VK_FORMAT_BC1_RGBA_UNORM_BLOCK = 133;
var VK_FORMAT_BC1_RGBA_SRGB_BLOCK = 134;
var VK_FORMAT_BC2_UNORM_BLOCK = 135;
var VK_FORMAT_BC2_SRGB_BLOCK = 136;
var VK_FORMAT_BC3_UNORM_BLOCK = 137;
var VK_FORMAT_BC3_SRGB_BLOCK = 138;
var VK_FORMAT_BC4_UNORM_BLOCK = 139;
var VK_FORMAT_BC4_SNORM_BLOCK = 140;
var VK_FORMAT_BC5_UNORM_BLOCK = 141;
var VK_FORMAT_BC5_SNORM_BLOCK = 142;
var VK_FORMAT_BC6H_UFLOAT_BLOCK = 143;
var VK_FORMAT_BC6H_SFLOAT_BLOCK = 144;
var VK_FORMAT_BC7_UNORM_BLOCK = 145;
var VK_FORMAT_BC7_SRGB_BLOCK = 146;
var VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK = 147;
var VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK = 148;
var VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK = 149;
var VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK = 150;
var VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK = 151;
var VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK = 152;
var VK_FORMAT_EAC_R11_UNORM_BLOCK = 153;
var VK_FORMAT_EAC_R11_SNORM_BLOCK = 154;
var VK_FORMAT_EAC_R11G11_UNORM_BLOCK = 155;
var VK_FORMAT_EAC_R11G11_SNORM_BLOCK = 156;
var VK_FORMAT_ASTC_4x4_UNORM_BLOCK = 157;
var VK_FORMAT_ASTC_4x4_SRGB_BLOCK = 158;
var VK_FORMAT_ASTC_5x4_UNORM_BLOCK = 159;
var VK_FORMAT_ASTC_5x4_SRGB_BLOCK = 160;
var VK_FORMAT_ASTC_5x5_UNORM_BLOCK = 161;
var VK_FORMAT_ASTC_5x5_SRGB_BLOCK = 162;
var VK_FORMAT_ASTC_6x5_UNORM_BLOCK = 163;
var VK_FORMAT_ASTC_6x5_SRGB_BLOCK = 164;
var VK_FORMAT_ASTC_6x6_UNORM_BLOCK = 165;
var VK_FORMAT_ASTC_6x6_SRGB_BLOCK = 166;
var VK_FORMAT_ASTC_8x5_UNORM_BLOCK = 167;
var VK_FORMAT_ASTC_8x5_SRGB_BLOCK = 168;
var VK_FORMAT_ASTC_8x6_UNORM_BLOCK = 169;
var VK_FORMAT_ASTC_8x6_SRGB_BLOCK = 170;
var VK_FORMAT_ASTC_8x8_UNORM_BLOCK = 171;
var VK_FORMAT_ASTC_8x8_SRGB_BLOCK = 172;
var VK_FORMAT_ASTC_10x5_UNORM_BLOCK = 173;
var VK_FORMAT_ASTC_10x5_SRGB_BLOCK = 174;
var VK_FORMAT_ASTC_10x6_UNORM_BLOCK = 175;
var VK_FORMAT_ASTC_10x6_SRGB_BLOCK = 176;
var VK_FORMAT_ASTC_10x8_UNORM_BLOCK = 177;
var VK_FORMAT_ASTC_10x8_SRGB_BLOCK = 178;
var VK_FORMAT_ASTC_10x10_UNORM_BLOCK = 179;
var VK_FORMAT_ASTC_10x10_SRGB_BLOCK = 180;
var VK_FORMAT_ASTC_12x10_UNORM_BLOCK = 181;
var VK_FORMAT_ASTC_12x10_SRGB_BLOCK = 182;
var VK_FORMAT_ASTC_12x12_UNORM_BLOCK = 183;
var VK_FORMAT_ASTC_12x12_SRGB_BLOCK = 184;
var VK_FORMAT_R10X6_UNORM_PACK16 = 1000156007;
var VK_FORMAT_R10X6G10X6_UNORM_2PACK16 = 1000156008;
var VK_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16 = 1000156009;
var VK_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16 = 1000156010;
var VK_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16 = 1000156011;
var VK_FORMAT_R12X4_UNORM_PACK16 = 1000156017;
var VK_FORMAT_R12X4G12X4_UNORM_2PACK16 = 1000156018;
var VK_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16 = 1000156019;
var VK_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16 = 1000156020;
var VK_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16 = 1000156021;
var VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG = 1000054e3;
var VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG = 1000054001;
var VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG = 1000054002;
var VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG = 1000054003;
var VK_FORMAT_PVRTC1_2BPP_SRGB_BLOCK_IMG = 1000054004;
var VK_FORMAT_PVRTC1_4BPP_SRGB_BLOCK_IMG = 1000054005;
var VK_FORMAT_PVRTC2_2BPP_SRGB_BLOCK_IMG = 1000054006;
var VK_FORMAT_PVRTC2_4BPP_SRGB_BLOCK_IMG = 1000054007;
var VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT = 1000066e3;
var VK_FORMAT_ASTC_5x4_SFLOAT_BLOCK_EXT = 1000066001;
var VK_FORMAT_ASTC_5x5_SFLOAT_BLOCK_EXT = 1000066002;
var VK_FORMAT_ASTC_6x5_SFLOAT_BLOCK_EXT = 1000066003;
var VK_FORMAT_ASTC_6x6_SFLOAT_BLOCK_EXT = 1000066004;
var VK_FORMAT_ASTC_8x5_SFLOAT_BLOCK_EXT = 1000066005;
var VK_FORMAT_ASTC_8x6_SFLOAT_BLOCK_EXT = 1000066006;
var VK_FORMAT_ASTC_8x8_SFLOAT_BLOCK_EXT = 1000066007;
var VK_FORMAT_ASTC_10x5_SFLOAT_BLOCK_EXT = 1000066008;
var VK_FORMAT_ASTC_10x6_SFLOAT_BLOCK_EXT = 1000066009;
var VK_FORMAT_ASTC_10x8_SFLOAT_BLOCK_EXT = 1000066010;
var VK_FORMAT_ASTC_10x10_SFLOAT_BLOCK_EXT = 1000066011;
var VK_FORMAT_ASTC_12x10_SFLOAT_BLOCK_EXT = 1000066012;
var VK_FORMAT_ASTC_12x12_SFLOAT_BLOCK_EXT = 1000066013;
var VK_FORMAT_A4R4G4B4_UNORM_PACK16_EXT = 100034e4;
var VK_FORMAT_A4B4G4R4_UNORM_PACK16_EXT = 1000340001;
var KTX2Container = class {
  constructor() {
    this.vkFormat = VK_FORMAT_UNDEFINED;
    this.typeSize = 1;
    this.pixelWidth = 0;
    this.pixelHeight = 0;
    this.pixelDepth = 0;
    this.layerCount = 0;
    this.faceCount = 1;
    this.supercompressionScheme = KHR_SUPERCOMPRESSION_NONE;
    this.levels = [];
    this.dataFormatDescriptor = [
      {
        vendorId: KHR_DF_VENDORID_KHRONOS,
        descriptorType: KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT,
        descriptorBlockSize: 0,
        versionNumber: KHR_DF_VERSION,
        colorModel: KHR_DF_MODEL_UNSPECIFIED,
        colorPrimaries: KHR_DF_PRIMARIES_BT709,
        transferFunction: KHR_DF_TRANSFER_SRGB,
        flags: KHR_DF_FLAG_ALPHA_STRAIGHT,
        texelBlockDimension: [0, 0, 0, 0],
        bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
        samples: []
      }
    ];
    this.keyValue = {};
    this.globalData = null;
  }
};
var BufferReader = class {
  constructor(data, byteOffset, byteLength, littleEndian) {
    this._dataView = void 0;
    this._littleEndian = void 0;
    this._offset = void 0;
    this._dataView = new DataView(data.buffer, data.byteOffset + byteOffset, byteLength);
    this._littleEndian = littleEndian;
    this._offset = 0;
  }
  _nextUint8() {
    const value = this._dataView.getUint8(this._offset);
    this._offset += 1;
    return value;
  }
  _nextUint16() {
    const value = this._dataView.getUint16(this._offset, this._littleEndian);
    this._offset += 2;
    return value;
  }
  _nextUint8Array(len) {
    const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, len);
    this._offset += len;
    return value;
  }
  _nextUint32() {
    const value = this._dataView.getUint32(this._offset, this._littleEndian);
    this._offset += 4;
    return value;
  }
  _nextUint64() {
    const left = this._dataView.getUint32(this._offset, this._littleEndian);
    const right = this._dataView.getUint32(this._offset + 4, this._littleEndian);
    const value = left + 2 ** 32 * right;
    this._offset += 8;
    return value;
  }
  _nextInt32() {
    const value = this._dataView.getInt32(this._offset, this._littleEndian);
    this._offset += 4;
    return value;
  }
  _skip(bytes) {
    this._offset += bytes;
    return this;
  }
  _scan(maxByteLength, term = 0) {
    const byteOffset = this._offset;
    let byteLength = 0;
    while (this._dataView.getUint8(this._offset) !== term && byteLength < maxByteLength) {
      byteLength++;
      this._offset++;
    }
    if (byteLength < maxByteLength) this._offset++;
    return new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + byteOffset, byteLength);
  }
};
var KTX_WRITER = `KTX-Parse v${"0.5.0"}`;
var NUL = new Uint8Array([0]);
var KTX2_ID = [
  // '´', 'K', 'T', 'X', '2', '0', 'ª', '\r', '\n', '\x1A', '\n'
  171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10
];
var HEADER_BYTE_LENGTH = 68;
function encodeText(text) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(text);
  }
  return Buffer.from(text);
}
function decodeText(buffer) {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder().decode(buffer);
  }
  return Buffer.from(buffer).toString("utf8");
}
function concat(buffers) {
  let totalByteLength = 0;
  for (const buffer of buffers) {
    totalByteLength += buffer.byteLength;
  }
  const result = new Uint8Array(totalByteLength);
  let byteOffset = 0;
  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), byteOffset);
    byteOffset += buffer.byteLength;
  }
  return result;
}
function read(data) {
  const id = new Uint8Array(data.buffer, data.byteOffset, KTX2_ID.length);
  if (
    id[0] !== KTX2_ID[0] || // '´'
    id[1] !== KTX2_ID[1] || // 'K'
    id[2] !== KTX2_ID[2] || // 'T'
    id[3] !== KTX2_ID[3] || // 'X'
    id[4] !== KTX2_ID[4] || // ' '
    id[5] !== KTX2_ID[5] || // '2'
    id[6] !== KTX2_ID[6] || // '0'
    id[7] !== KTX2_ID[7] || // 'ª'
    id[8] !== KTX2_ID[8] || // '\r'
    id[9] !== KTX2_ID[9] || // '\n'
    id[10] !== KTX2_ID[10] || // '\x1A'
    id[11] !== KTX2_ID[11]
  ) {
    throw new Error("Missing KTX 2.0 identifier.");
  }
  const container = new KTX2Container();
  const headerByteLength = 17 * Uint32Array.BYTES_PER_ELEMENT;
  const headerReader = new BufferReader(data, KTX2_ID.length, headerByteLength, true);
  container.vkFormat = headerReader._nextUint32();
  container.typeSize = headerReader._nextUint32();
  container.pixelWidth = headerReader._nextUint32();
  container.pixelHeight = headerReader._nextUint32();
  container.pixelDepth = headerReader._nextUint32();
  container.layerCount = headerReader._nextUint32();
  container.faceCount = headerReader._nextUint32();
  const levelCount = headerReader._nextUint32();
  container.supercompressionScheme = headerReader._nextUint32();
  const dfdByteOffset = headerReader._nextUint32();
  const dfdByteLength = headerReader._nextUint32();
  const kvdByteOffset = headerReader._nextUint32();
  const kvdByteLength = headerReader._nextUint32();
  const sgdByteOffset = headerReader._nextUint64();
  const sgdByteLength = headerReader._nextUint64();
  const levelByteLength = levelCount * 3 * 8;
  const levelReader = new BufferReader(data, KTX2_ID.length + headerByteLength, levelByteLength, true);
  for (let i = 0; i < levelCount; i++) {
    container.levels.push({
      levelData: new Uint8Array(data.buffer, data.byteOffset + levelReader._nextUint64(), levelReader._nextUint64()),
      uncompressedByteLength: levelReader._nextUint64()
    });
  }
  const dfdReader = new BufferReader(data, dfdByteOffset, dfdByteLength, true);
  const dfd = {
    vendorId: dfdReader
      ._skip(
        4
        /* totalSize */
      )
      ._nextUint16(),
    descriptorType: dfdReader._nextUint16(),
    versionNumber: dfdReader._nextUint16(),
    descriptorBlockSize: dfdReader._nextUint16(),
    colorModel: dfdReader._nextUint8(),
    colorPrimaries: dfdReader._nextUint8(),
    transferFunction: dfdReader._nextUint8(),
    flags: dfdReader._nextUint8(),
    texelBlockDimension: [
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8()
    ],
    bytesPlane: [
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8(),
      dfdReader._nextUint8()
    ],
    samples: []
  };
  const sampleStart = 6;
  const sampleWords = 4;
  const numSamples = (dfd.descriptorBlockSize / 4 - sampleStart) / sampleWords;
  for (let i = 0; i < numSamples; i++) {
    const sample = {
      bitOffset: dfdReader._nextUint16(),
      bitLength: dfdReader._nextUint8(),
      channelType: dfdReader._nextUint8(),
      samplePosition: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
      sampleLower: -Infinity,
      sampleUpper: Infinity
    };
    if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
      sample.sampleLower = dfdReader._nextInt32();
      sample.sampleUpper = dfdReader._nextInt32();
    } else {
      sample.sampleLower = dfdReader._nextUint32();
      sample.sampleUpper = dfdReader._nextUint32();
    }
    dfd.samples[i] = sample;
  }
  container.dataFormatDescriptor.length = 0;
  container.dataFormatDescriptor.push(dfd);
  const kvdReader = new BufferReader(data, kvdByteOffset, kvdByteLength, true);
  while (kvdReader._offset < kvdByteLength) {
    const keyValueByteLength = kvdReader._nextUint32();
    const keyData = kvdReader._scan(keyValueByteLength);
    const key = decodeText(keyData);
    const kvPadding = (keyValueByteLength % 4 ? 4 - (keyValueByteLength % 4) : 0);
    const valueData = kvdReader._nextUint8Array(keyValueByteLength - keyData.byteLength - 2);
    container.keyValue[key] = key.match(/^ktx/i) ? decodeText(valueData) : valueData;
    kvdReader._skip(kvPadding + 1);
  }
  if (sgdByteLength <= 0) return container;
  const sgdReader = new BufferReader(data, sgdByteOffset, sgdByteLength, true);
  const endpointCount = sgdReader._nextUint16();
  const selectorCount = sgdReader._nextUint16();
  const endpointsByteLength = sgdReader._nextUint32();
  const selectorsByteLength = sgdReader._nextUint32();
  const tablesByteLength = sgdReader._nextUint32();
  const extendedByteLength = sgdReader._nextUint32();
  const imageDescs = [];
  for (let i = 0; i < levelCount; i++) {
    imageDescs.push({
      imageFlags: sgdReader._nextUint32(),
      rgbSliceByteOffset: sgdReader._nextUint32(),
      rgbSliceByteLength: sgdReader._nextUint32(),
      alphaSliceByteOffset: sgdReader._nextUint32(),
      alphaSliceByteLength: sgdReader._nextUint32()
    });
  }
  const endpointsByteOffset = sgdByteOffset + sgdReader._offset;
  const selectorsByteOffset = endpointsByteOffset + endpointsByteLength;
  const tablesByteOffset = selectorsByteOffset + selectorsByteLength;
  const extendedByteOffset = tablesByteOffset + tablesByteLength;
  const endpointsData = new Uint8Array(data.buffer, data.byteOffset + endpointsByteOffset, endpointsByteLength);
  const selectorsData = new Uint8Array(data.buffer, data.byteOffset + selectorsByteOffset, selectorsByteLength);
  const tablesData = new Uint8Array(data.buffer, data.byteOffset + tablesByteOffset, tablesByteLength);
  const extendedData = new Uint8Array(data.buffer, data.byteOffset + extendedByteOffset, extendedByteLength);
  container.globalData = {
    endpointCount,
    selectorCount,
    imageDescs,
    endpointsData,
    selectorsData,
    tablesData,
    extendedData
  };
  return container;
}
function _extends() {
  _extends = Object.assign
    ? Object.assign.bind()
    : function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
  return _extends.apply(this, arguments);
}
var DEFAULT_OPTIONS = {
  keepWriter: false
};
function write(container, options = {}) {
  options = _extends({}, DEFAULT_OPTIONS, options);
  let sgdBuffer = new ArrayBuffer(0);
  if (container.globalData) {
    const sgdHeaderBuffer = new ArrayBuffer(20 + container.globalData.imageDescs.length * 5 * 4);
    const sgdHeaderView = new DataView(sgdHeaderBuffer);
    sgdHeaderView.setUint16(0, container.globalData.endpointCount, true);
    sgdHeaderView.setUint16(2, container.globalData.selectorCount, true);
    sgdHeaderView.setUint32(4, container.globalData.endpointsData.byteLength, true);
    sgdHeaderView.setUint32(8, container.globalData.selectorsData.byteLength, true);
    sgdHeaderView.setUint32(12, container.globalData.tablesData.byteLength, true);
    sgdHeaderView.setUint32(16, container.globalData.extendedData.byteLength, true);
    for (let i = 0; i < container.globalData.imageDescs.length; i++) {
      const imageDesc = container.globalData.imageDescs[i];
      sgdHeaderView.setUint32(20 + i * 5 * 4 + 0, imageDesc.imageFlags, true);
      sgdHeaderView.setUint32(20 + i * 5 * 4 + 4, imageDesc.rgbSliceByteOffset, true);
      sgdHeaderView.setUint32(20 + i * 5 * 4 + 8, imageDesc.rgbSliceByteLength, true);
      sgdHeaderView.setUint32(20 + i * 5 * 4 + 12, imageDesc.alphaSliceByteOffset, true);
      sgdHeaderView.setUint32(20 + i * 5 * 4 + 16, imageDesc.alphaSliceByteLength, true);
    }
    sgdBuffer = concat([
      sgdHeaderBuffer,
      container.globalData.endpointsData,
      container.globalData.selectorsData,
      container.globalData.tablesData,
      container.globalData.extendedData
    ]);
  }
  const keyValueData = [];
  let keyValue = container.keyValue;
  if (!options.keepWriter) {
    keyValue = _extends({}, container.keyValue, {
      KTXwriter: KTX_WRITER
    });
  }
  for (const key in keyValue) {
    const value = keyValue[key];
    const keyData = encodeText(key);
    const valueData = typeof value === "string" ? encodeText(value) : value;
    const kvByteLength = keyData.byteLength + 1 + valueData.byteLength + 1;
    const kvPadding = kvByteLength % 4 ? 4 - (kvByteLength % 4) : 0;
    keyValueData.push(
      concat([
        new Uint32Array([kvByteLength]),
        keyData,
        NUL,
        valueData,
        NUL,
        new Uint8Array(kvPadding).fill(0)
        // align(4)
      ])
    );
  }
  const kvdBuffer = concat(keyValueData);
  if (
    container.dataFormatDescriptor.length !== 1 ||
    container.dataFormatDescriptor[0].descriptorType !== KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT
  ) {
    throw new Error("Only BASICFORMAT Data Format Descriptor output supported.");
  }
  const dfd = container.dataFormatDescriptor[0];
  const dfdBuffer = new ArrayBuffer(28 + dfd.samples.length * 16);
  const dfdView = new DataView(dfdBuffer);
  const descriptorBlockSize = 24 + dfd.samples.length * 16;
  dfdView.setUint32(0, dfdBuffer.byteLength, true);
  dfdView.setUint16(4, dfd.vendorId, true);
  dfdView.setUint16(6, dfd.descriptorType, true);
  dfdView.setUint16(8, dfd.versionNumber, true);
  dfdView.setUint16(10, descriptorBlockSize, true);
  dfdView.setUint8(12, dfd.colorModel);
  dfdView.setUint8(13, dfd.colorPrimaries);
  dfdView.setUint8(14, dfd.transferFunction);
  dfdView.setUint8(15, dfd.flags);
  if (!Array.isArray(dfd.texelBlockDimension)) {
    throw new Error("texelBlockDimension is now an array. For dimensionality `d`, set `d - 1`.");
  }
  dfdView.setUint8(16, dfd.texelBlockDimension[0]);
  dfdView.setUint8(17, dfd.texelBlockDimension[1]);
  dfdView.setUint8(18, dfd.texelBlockDimension[2]);
  dfdView.setUint8(19, dfd.texelBlockDimension[3]);
  for (let i = 0; i < 8; i++) dfdView.setUint8(20 + i, dfd.bytesPlane[i]);
  for (let i = 0; i < dfd.samples.length; i++) {
    const sample = dfd.samples[i];
    const sampleByteOffset = 28 + i * 16;
    if (sample.channelID) {
      throw new Error("channelID has been renamed to channelType.");
    }
    dfdView.setUint16(sampleByteOffset + 0, sample.bitOffset, true);
    dfdView.setUint8(sampleByteOffset + 2, sample.bitLength);
    dfdView.setUint8(sampleByteOffset + 3, sample.channelType);
    dfdView.setUint8(sampleByteOffset + 4, sample.samplePosition[0]);
    dfdView.setUint8(sampleByteOffset + 5, sample.samplePosition[1]);
    dfdView.setUint8(sampleByteOffset + 6, sample.samplePosition[2]);
    dfdView.setUint8(sampleByteOffset + 7, sample.samplePosition[3]);
    if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
      dfdView.setInt32(sampleByteOffset + 8, sample.sampleLower, true);
      dfdView.setInt32(sampleByteOffset + 12, sample.sampleUpper, true);
    } else {
      dfdView.setUint32(sampleByteOffset + 8, sample.sampleLower, true);
      dfdView.setUint32(sampleByteOffset + 12, sample.sampleUpper, true);
    }
  }
  const dfdByteOffset = KTX2_ID.length + HEADER_BYTE_LENGTH + container.levels.length * 3 * 8;
  const kvdByteOffset = dfdByteOffset + dfdBuffer.byteLength;
  let sgdByteOffset = sgdBuffer.byteLength > 0 ? kvdByteOffset + kvdBuffer.byteLength : 0;
  if (sgdByteOffset % 8) sgdByteOffset += 8 - (sgdByteOffset % 8);
  const levelData = [];
  const levelIndex = new DataView(new ArrayBuffer(container.levels.length * 3 * 8));
  let levelDataByteOffset = (sgdByteOffset || kvdByteOffset + kvdBuffer.byteLength) + sgdBuffer.byteLength;
  for (let i = 0; i < container.levels.length; i++) {
    const level = container.levels[i];
    levelData.push(level.levelData);
    levelIndex.setBigUint64(i * 24 + 0, BigInt(levelDataByteOffset), true);
    levelIndex.setBigUint64(i * 24 + 8, BigInt(level.levelData.byteLength), true);
    levelIndex.setBigUint64(i * 24 + 16, BigInt(level.uncompressedByteLength), true);
    levelDataByteOffset += level.levelData.byteLength;
  }
  const headerBuffer = new ArrayBuffer(HEADER_BYTE_LENGTH);
  const headerView = new DataView(headerBuffer);
  headerView.setUint32(0, container.vkFormat, true);
  headerView.setUint32(4, container.typeSize, true);
  headerView.setUint32(8, container.pixelWidth, true);
  headerView.setUint32(12, container.pixelHeight, true);
  headerView.setUint32(16, container.pixelDepth, true);
  headerView.setUint32(20, container.layerCount, true);
  headerView.setUint32(24, container.faceCount, true);
  headerView.setUint32(28, container.levels.length, true);
  headerView.setUint32(32, container.supercompressionScheme, true);
  headerView.setUint32(36, dfdByteOffset, true);
  headerView.setUint32(40, dfdBuffer.byteLength, true);
  headerView.setUint32(44, kvdByteOffset, true);
  headerView.setUint32(48, kvdBuffer.byteLength, true);
  headerView.setBigUint64(52, BigInt(sgdBuffer.byteLength > 0 ? sgdByteOffset : 0), true);
  headerView.setBigUint64(60, BigInt(sgdBuffer.byteLength), true);
  return new Uint8Array(
    concat([
      new Uint8Array(KTX2_ID).buffer,
      headerBuffer,
      levelIndex.buffer,
      dfdBuffer,
      kvdBuffer,
      sgdByteOffset > 0 ? new ArrayBuffer(sgdByteOffset - (kvdByteOffset + kvdBuffer.byteLength)) : new ArrayBuffer(0),
      sgdBuffer,
      ...levelData
    ])
  );
}
export {
  KHR_DF_CHANNEL_RGBSDA_ALPHA,
  KHR_DF_CHANNEL_RGBSDA_BLUE,
  KHR_DF_CHANNEL_RGBSDA_DEPTH,
  KHR_DF_CHANNEL_RGBSDA_GREEN,
  KHR_DF_CHANNEL_RGBSDA_RED,
  KHR_DF_CHANNEL_RGBSDA_STENCIL,
  KHR_DF_FLAG_ALPHA_PREMULTIPLIED,
  KHR_DF_FLAG_ALPHA_STRAIGHT,
  KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT,
  KHR_DF_MODEL_ASTC,
  KHR_DF_MODEL_ETC1,
  KHR_DF_MODEL_ETC1S,
  KHR_DF_MODEL_ETC2,
  KHR_DF_MODEL_RGBSDA,
  KHR_DF_MODEL_UASTC,
  KHR_DF_MODEL_UNSPECIFIED,
  KHR_DF_PRIMARIES_ACES,
  KHR_DF_PRIMARIES_ACESCC,
  KHR_DF_PRIMARIES_ADOBERGB,
  KHR_DF_PRIMARIES_BT2020,
  KHR_DF_PRIMARIES_BT601_EBU,
  KHR_DF_PRIMARIES_BT601_SMPTE,
  KHR_DF_PRIMARIES_BT709,
  KHR_DF_PRIMARIES_CIEXYZ,
  KHR_DF_PRIMARIES_DISPLAYP3,
  KHR_DF_PRIMARIES_NTSC1953,
  KHR_DF_PRIMARIES_PAL525,
  KHR_DF_PRIMARIES_UNSPECIFIED,
  KHR_DF_SAMPLE_DATATYPE_EXPONENT,
  KHR_DF_SAMPLE_DATATYPE_FLOAT,
  KHR_DF_SAMPLE_DATATYPE_LINEAR,
  KHR_DF_SAMPLE_DATATYPE_SIGNED,
  KHR_DF_TRANSFER_ACESCC,
  KHR_DF_TRANSFER_ACESCCT,
  KHR_DF_TRANSFER_ADOBERGB,
  KHR_DF_TRANSFER_BT1886,
  KHR_DF_TRANSFER_DCIP3,
  KHR_DF_TRANSFER_HLG_EOTF,
  KHR_DF_TRANSFER_HLG_OETF,
  KHR_DF_TRANSFER_ITU,
  KHR_DF_TRANSFER_LINEAR,
  KHR_DF_TRANSFER_NTSC,
  KHR_DF_TRANSFER_PAL625_EOTF,
  KHR_DF_TRANSFER_PAL_OETF,
  KHR_DF_TRANSFER_PQ_EOTF,
  KHR_DF_TRANSFER_PQ_OETF,
  KHR_DF_TRANSFER_SLOG,
  KHR_DF_TRANSFER_SLOG2,
  KHR_DF_TRANSFER_SRGB,
  KHR_DF_TRANSFER_ST240,
  KHR_DF_TRANSFER_UNSPECIFIED,
  KHR_DF_VENDORID_KHRONOS,
  KHR_DF_VERSION,
  KHR_SUPERCOMPRESSION_BASISLZ,
  KHR_SUPERCOMPRESSION_NONE,
  KHR_SUPERCOMPRESSION_ZLIB,
  KHR_SUPERCOMPRESSION_ZSTD,
  KTX2Container,
  VK_FORMAT_A1R5G5B5_UNORM_PACK16,
  VK_FORMAT_A2B10G10R10_SINT_PACK32,
  VK_FORMAT_A2B10G10R10_SNORM_PACK32,
  VK_FORMAT_A2B10G10R10_UINT_PACK32,
  VK_FORMAT_A2B10G10R10_UNORM_PACK32,
  VK_FORMAT_A2R10G10B10_SINT_PACK32,
  VK_FORMAT_A2R10G10B10_SNORM_PACK32,
  VK_FORMAT_A2R10G10B10_UINT_PACK32,
  VK_FORMAT_A2R10G10B10_UNORM_PACK32,
  VK_FORMAT_A4B4G4R4_UNORM_PACK16_EXT,
  VK_FORMAT_A4R4G4B4_UNORM_PACK16_EXT,
  VK_FORMAT_ASTC_10x10_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_10x10_SRGB_BLOCK,
  VK_FORMAT_ASTC_10x10_UNORM_BLOCK,
  VK_FORMAT_ASTC_10x5_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_10x5_SRGB_BLOCK,
  VK_FORMAT_ASTC_10x5_UNORM_BLOCK,
  VK_FORMAT_ASTC_10x6_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_10x6_SRGB_BLOCK,
  VK_FORMAT_ASTC_10x6_UNORM_BLOCK,
  VK_FORMAT_ASTC_10x8_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_10x8_SRGB_BLOCK,
  VK_FORMAT_ASTC_10x8_UNORM_BLOCK,
  VK_FORMAT_ASTC_12x10_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_12x10_SRGB_BLOCK,
  VK_FORMAT_ASTC_12x10_UNORM_BLOCK,
  VK_FORMAT_ASTC_12x12_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_12x12_SRGB_BLOCK,
  VK_FORMAT_ASTC_12x12_UNORM_BLOCK,
  VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_4x4_SRGB_BLOCK,
  VK_FORMAT_ASTC_4x4_UNORM_BLOCK,
  VK_FORMAT_ASTC_5x4_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_5x4_SRGB_BLOCK,
  VK_FORMAT_ASTC_5x4_UNORM_BLOCK,
  VK_FORMAT_ASTC_5x5_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_5x5_SRGB_BLOCK,
  VK_FORMAT_ASTC_5x5_UNORM_BLOCK,
  VK_FORMAT_ASTC_6x5_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_6x5_SRGB_BLOCK,
  VK_FORMAT_ASTC_6x5_UNORM_BLOCK,
  VK_FORMAT_ASTC_6x6_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_6x6_SRGB_BLOCK,
  VK_FORMAT_ASTC_6x6_UNORM_BLOCK,
  VK_FORMAT_ASTC_8x5_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_8x5_SRGB_BLOCK,
  VK_FORMAT_ASTC_8x5_UNORM_BLOCK,
  VK_FORMAT_ASTC_8x6_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_8x6_SRGB_BLOCK,
  VK_FORMAT_ASTC_8x6_UNORM_BLOCK,
  VK_FORMAT_ASTC_8x8_SFLOAT_BLOCK_EXT,
  VK_FORMAT_ASTC_8x8_SRGB_BLOCK,
  VK_FORMAT_ASTC_8x8_UNORM_BLOCK,
  VK_FORMAT_B10G11R11_UFLOAT_PACK32,
  VK_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16,
  VK_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16,
  VK_FORMAT_B4G4R4A4_UNORM_PACK16,
  VK_FORMAT_B5G5R5A1_UNORM_PACK16,
  VK_FORMAT_B5G6R5_UNORM_PACK16,
  VK_FORMAT_B8G8R8A8_SINT,
  VK_FORMAT_B8G8R8A8_SNORM,
  VK_FORMAT_B8G8R8A8_SRGB,
  VK_FORMAT_B8G8R8A8_UINT,
  VK_FORMAT_B8G8R8A8_UNORM,
  VK_FORMAT_B8G8R8_SINT,
  VK_FORMAT_B8G8R8_SNORM,
  VK_FORMAT_B8G8R8_SRGB,
  VK_FORMAT_B8G8R8_UINT,
  VK_FORMAT_B8G8R8_UNORM,
  VK_FORMAT_BC1_RGBA_SRGB_BLOCK,
  VK_FORMAT_BC1_RGBA_UNORM_BLOCK,
  VK_FORMAT_BC1_RGB_SRGB_BLOCK,
  VK_FORMAT_BC1_RGB_UNORM_BLOCK,
  VK_FORMAT_BC2_SRGB_BLOCK,
  VK_FORMAT_BC2_UNORM_BLOCK,
  VK_FORMAT_BC3_SRGB_BLOCK,
  VK_FORMAT_BC3_UNORM_BLOCK,
  VK_FORMAT_BC4_SNORM_BLOCK,
  VK_FORMAT_BC4_UNORM_BLOCK,
  VK_FORMAT_BC5_SNORM_BLOCK,
  VK_FORMAT_BC5_UNORM_BLOCK,
  VK_FORMAT_BC6H_SFLOAT_BLOCK,
  VK_FORMAT_BC6H_UFLOAT_BLOCK,
  VK_FORMAT_BC7_SRGB_BLOCK,
  VK_FORMAT_BC7_UNORM_BLOCK,
  VK_FORMAT_D16_UNORM,
  VK_FORMAT_D16_UNORM_S8_UINT,
  VK_FORMAT_D24_UNORM_S8_UINT,
  VK_FORMAT_D32_SFLOAT,
  VK_FORMAT_D32_SFLOAT_S8_UINT,
  VK_FORMAT_E5B9G9R9_UFLOAT_PACK32,
  VK_FORMAT_EAC_R11G11_SNORM_BLOCK,
  VK_FORMAT_EAC_R11G11_UNORM_BLOCK,
  VK_FORMAT_EAC_R11_SNORM_BLOCK,
  VK_FORMAT_EAC_R11_UNORM_BLOCK,
  VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK,
  VK_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK,
  VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK,
  VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK,
  VK_FORMAT_ETC2_R8G8B8_SRGB_BLOCK,
  VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK,
  VK_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16,
  VK_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16,
  VK_FORMAT_PVRTC1_2BPP_SRGB_BLOCK_IMG,
  VK_FORMAT_PVRTC1_2BPP_UNORM_BLOCK_IMG,
  VK_FORMAT_PVRTC1_4BPP_SRGB_BLOCK_IMG,
  VK_FORMAT_PVRTC1_4BPP_UNORM_BLOCK_IMG,
  VK_FORMAT_PVRTC2_2BPP_SRGB_BLOCK_IMG,
  VK_FORMAT_PVRTC2_2BPP_UNORM_BLOCK_IMG,
  VK_FORMAT_PVRTC2_4BPP_SRGB_BLOCK_IMG,
  VK_FORMAT_PVRTC2_4BPP_UNORM_BLOCK_IMG,
  VK_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16,
  VK_FORMAT_R10X6G10X6_UNORM_2PACK16,
  VK_FORMAT_R10X6_UNORM_PACK16,
  VK_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16,
  VK_FORMAT_R12X4G12X4_UNORM_2PACK16,
  VK_FORMAT_R12X4_UNORM_PACK16,
  VK_FORMAT_R16G16B16A16_SFLOAT,
  VK_FORMAT_R16G16B16A16_SINT,
  VK_FORMAT_R16G16B16A16_SNORM,
  VK_FORMAT_R16G16B16A16_UINT,
  VK_FORMAT_R16G16B16A16_UNORM,
  VK_FORMAT_R16G16B16_SFLOAT,
  VK_FORMAT_R16G16B16_SINT,
  VK_FORMAT_R16G16B16_SNORM,
  VK_FORMAT_R16G16B16_UINT,
  VK_FORMAT_R16G16B16_UNORM,
  VK_FORMAT_R16G16_SFLOAT,
  VK_FORMAT_R16G16_SINT,
  VK_FORMAT_R16G16_SNORM,
  VK_FORMAT_R16G16_UINT,
  VK_FORMAT_R16G16_UNORM,
  VK_FORMAT_R16_SFLOAT,
  VK_FORMAT_R16_SINT,
  VK_FORMAT_R16_SNORM,
  VK_FORMAT_R16_UINT,
  VK_FORMAT_R16_UNORM,
  VK_FORMAT_R32G32B32A32_SFLOAT,
  VK_FORMAT_R32G32B32A32_SINT,
  VK_FORMAT_R32G32B32A32_UINT,
  VK_FORMAT_R32G32B32_SFLOAT,
  VK_FORMAT_R32G32B32_SINT,
  VK_FORMAT_R32G32B32_UINT,
  VK_FORMAT_R32G32_SFLOAT,
  VK_FORMAT_R32G32_SINT,
  VK_FORMAT_R32G32_UINT,
  VK_FORMAT_R32_SFLOAT,
  VK_FORMAT_R32_SINT,
  VK_FORMAT_R32_UINT,
  VK_FORMAT_R4G4B4A4_UNORM_PACK16,
  VK_FORMAT_R4G4_UNORM_PACK8,
  VK_FORMAT_R5G5B5A1_UNORM_PACK16,
  VK_FORMAT_R5G6B5_UNORM_PACK16,
  VK_FORMAT_R64G64B64A64_SFLOAT,
  VK_FORMAT_R64G64B64A64_SINT,
  VK_FORMAT_R64G64B64A64_UINT,
  VK_FORMAT_R64G64B64_SFLOAT,
  VK_FORMAT_R64G64B64_SINT,
  VK_FORMAT_R64G64B64_UINT,
  VK_FORMAT_R64G64_SFLOAT,
  VK_FORMAT_R64G64_SINT,
  VK_FORMAT_R64G64_UINT,
  VK_FORMAT_R64_SFLOAT,
  VK_FORMAT_R64_SINT,
  VK_FORMAT_R64_UINT,
  VK_FORMAT_R8G8B8A8_SINT,
  VK_FORMAT_R8G8B8A8_SNORM,
  VK_FORMAT_R8G8B8A8_SRGB,
  VK_FORMAT_R8G8B8A8_UINT,
  VK_FORMAT_R8G8B8A8_UNORM,
  VK_FORMAT_R8G8B8_SINT,
  VK_FORMAT_R8G8B8_SNORM,
  VK_FORMAT_R8G8B8_SRGB,
  VK_FORMAT_R8G8B8_UINT,
  VK_FORMAT_R8G8B8_UNORM,
  VK_FORMAT_R8G8_SINT,
  VK_FORMAT_R8G8_SNORM,
  VK_FORMAT_R8G8_SRGB,
  VK_FORMAT_R8G8_UINT,
  VK_FORMAT_R8G8_UNORM,
  VK_FORMAT_R8_SINT,
  VK_FORMAT_R8_SNORM,
  VK_FORMAT_R8_SRGB,
  VK_FORMAT_R8_UINT,
  VK_FORMAT_R8_UNORM,
  VK_FORMAT_S8_UINT,
  VK_FORMAT_UNDEFINED,
  VK_FORMAT_X8_D24_UNORM_PACK32,
  read,
  write
};
//# sourceMappingURL=ktx-parse.js.map
