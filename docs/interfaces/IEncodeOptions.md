[ktx2-encoder](../README.md) / [Exports](../modules.md) / IEncodeOptions

# Interface: IEncodeOptions

## Table of contents

### Properties

- [compressionLevel](IEncodeOptions.md#compressionlevel)
- [enableDebug](IEncodeOptions.md#enabledebug)
- [generateMipmap](IEncodeOptions.md#generatemipmap)
- [isKTX2File](IEncodeOptions.md#isktx2file)
- [isNormalMap](IEncodeOptions.md#isnormalmap)
- [isSetKTX2SRGBTransferFunc](IEncodeOptions.md#issetktx2srgbtransferfunc)
- [isUASTC](IEncodeOptions.md#isuastc)
- [isYFlip](IEncodeOptions.md#isyflip)
- [needSupercompression](IEncodeOptions.md#needsupercompression)
- [qualityLevel](IEncodeOptions.md#qualitylevel)

## Properties

### compressionLevel

• **compressionLevel**: `number`

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

#### Defined in

index.ts:24

___

### enableDebug

• **enableDebug**: `boolean`

enable debug output, default is false

#### Defined in

index.ts:8

___

### generateMipmap

• **generateMipmap**: `boolean`

If true mipmaps will be generated from the source images

#### Defined in

index.ts:40

___

### isKTX2File

• **isKTX2File**: `boolean`

Create .KTX2 files instead of .basis files. By default this is FALSE.

#### Defined in

index.ts:44

___

### isNormalMap

• **isNormalMap**: `boolean`

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

#### Defined in

index.ts:32

___

### isSetKTX2SRGBTransferFunc

• **isSetKTX2SRGBTransferFunc**: `boolean`

Input source is sRGB. This should very probably match the "perceptual" setting.

#### Defined in

index.ts:36

___

### isUASTC

• **isUASTC**: `boolean`

is UASTC texture, default is true

#### Defined in

index.ts:12

___

### isYFlip

• **isYFlip**: `boolean`

if true the source images will be Y flipped before compression, default is false

#### Defined in

index.ts:16

___

### needSupercompression

• **needSupercompression**: `boolean`

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

#### Defined in

index.ts:28

___

### qualityLevel

• **qualityLevel**: `number`

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.

#### Defined in

index.ts:20
