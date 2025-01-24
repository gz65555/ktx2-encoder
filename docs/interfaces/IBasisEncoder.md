[**ktx2-encoder**](../README.md)

***

[ktx2-encoder](../globals.md) / IBasisEncoder

# Interface: IBasisEncoder

Defined in: [type.ts:3](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L3)

## Constructors

### new IBasisEncoder()

> **new IBasisEncoder**(): [`IBasisEncoder`](IBasisEncoder.md)

Defined in: [type.ts:121](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L121)

#### Returns

[`IBasisEncoder`](IBasisEncoder.md)

## Methods

### delete()

> **delete**(): `void`

Defined in: [type.ts:86](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L86)

release memory

#### Returns

`void`

***

### encode()

> **encode**(`pngBuffer`): `number`

Defined in: [type.ts:26](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L26)

Compresses the provided source slice(s) to an output .basis file.
At the minimum, you must provided at least 1 source slice by calling setSliceSourceImage() before calling this method.

#### Parameters

##### pngBuffer

`Uint8Array`

#### Returns

`number`

byte length of encoded data

***

### setCompressionLevel()

> **setCompressionLevel**(`level`): `void`

Defined in: [type.ts:60](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L60)

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

#### Parameters

##### level

`number`

Default is 2, range is [0, 6]

#### Returns

`void`

***

### setCreateKTX2File()

> **setCreateKTX2File**(`isKTX2`): `void`

Defined in: [type.ts:69](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L69)

Create .KTX2 files instead of .basis files. By default this is FALSE.

#### Parameters

##### isKTX2

`boolean`

#### Returns

`void`

***

### setDebug()

> **setDebug**(`isDebug`): `void`

Defined in: [type.ts:49](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L49)

Enables debug output	to stdout

#### Parameters

##### isDebug

`boolean`

#### Returns

`void`

***

### setEndpointRDOThresh()

> **setEndpointRDOThresh**(`endpoint_rdo_thresh`): `void`

Defined in: [type.ts:119](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L119)

Default is BASISU_DEFAULT_ENDPOINT_RDO_THRESH, range is [0,1e+10]

#### Parameters

##### endpoint\_rdo\_thresh

`number`

#### Returns

`void`

***

### setKTX2SRGBTransferFunc()

> **setKTX2SRGBTransferFunc**(`srgbTransferFunc`): `void`

Defined in: [type.ts:79](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L79)

Use sRGB transfer func in the file's DFD. Default is FALSE. This should very probably match the "perceptual" setting.

#### Parameters

##### srgbTransferFunc

`boolean`

need sRGB transfer func

#### Returns

`void`

***

### setKTX2UASTCSupercompression()

> **setKTX2UASTCSupercompression**(`needSupercompression`): `void`

Defined in: [type.ts:40](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L40)

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

#### Parameters

##### needSupercompression

`boolean`

#### Returns

`void`

***

### setMaxEndpointClusters()

> **setMaxEndpointClusters**(`max_endpoint_clusters`): `void`

Defined in: [type.ts:107](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L107)

Sets the max # of endpoint clusters for ETC1S mode. Use instead of setQualityLevel.
Default is 512, range is [1, 16128]

#### Parameters

##### max\_endpoint\_clusters

`number`

#### Returns

`void`

***

### setMaxSelectorClusters()

> **setMaxSelectorClusters**(`max_selector_clusters`): `void`

Defined in: [type.ts:113](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L113)

Sets the max # of selectors clusters for ETC1S mode. Use instead of setQualityLevel.
Default is 512, range is [1, 16128]

#### Parameters

##### max\_selector\_clusters

`number`

#### Returns

`void`

***

### setMipGen()

> **setMipGen**(`needGenMipmap`): `void`

Defined in: [type.ts:74](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L74)

If true mipmaps will be generated from the source images

#### Parameters

##### needGenMipmap

`boolean`

#### Returns

`void`

***

### setNormalMap()

> **setNormalMap**(): `void`

Defined in: [type.ts:64](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L64)

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

#### Returns

`void`

***

### setPerceptual()

> **setPerceptual**(`perceptual`): `void`

Defined in: [type.ts:83](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L83)

If true, the input is assumed to be in sRGB space. Be sure to set this correctly! (Examples: True on photos, albedo/spec maps, and false on normal maps.)

#### Parameters

##### perceptual

`boolean`

#### Returns

`void`

***

### setQualityLevel()

> **setQualityLevel**(`level`): `void`

Defined in: [type.ts:55](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L55)

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.
Default is -1 (meaning unused - the compressor will use m_max_endpoint_clusters/m_max_selector_clusters instead to control the codebook sizes).

#### Parameters

##### level

`number`

Range is [1, 255]

#### Returns

`void`

***

### setRDOUASTC()

> **setRDOUASTC**(`rdoUASTC`): `void`

Defined in: [type.ts:89](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L89)

If true, the RDO post-processor will be applied to the encoded UASTC texture data.

#### Parameters

##### rdoUASTC

`boolean`

#### Returns

`void`

***

### setRDOUASTCDictSize()

> **setRDOUASTCDictSize**(`dictSize`): `void`

Defined in: [type.ts:95](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L95)

Default is 4096, range is [64, 65535]

#### Parameters

##### dictSize

`number`

#### Returns

`void`

***

### setRDOUASTCMaxAllowedRMSIncreaseRatio()

> **setRDOUASTCMaxAllowedRMSIncreaseRatio**(`rdo_uastc_max_allowed_rms_increase_ratio`): `any`

Defined in: [type.ts:98](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L98)

Default is 10.0f, range is [01, 100.0]

#### Parameters

##### rdo\_uastc\_max\_allowed\_rms\_increase\_ratio

`number`

#### Returns

`any`

***

### setRDOUASTCQualityScalar()

> **setRDOUASTCQualityScalar**(`rdo_quality`): `void`

Defined in: [type.ts:92](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L92)

#### Parameters

##### rdo\_quality

`number`

#### Returns

`void`

***

### setRDOUASTCSkipBlockRMSThresh()

> **setRDOUASTCSkipBlockRMSThresh**(`rdo_uastc_skip_block_rms_thresh`): `any`

Defined in: [type.ts:101](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L101)

Default is 8.0f, range is [.01f, 100.0f]

#### Parameters

##### rdo\_uastc\_skip\_block\_rms\_thresh

`number`

#### Returns

`any`

***

### setSelectorRDOThresh()

> **setSelectorRDOThresh**(`selector_rdo_thresh`): `void`

Defined in: [type.ts:116](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L116)

Default is BASISU_DEFAULT_SELECTOR_RDO_THRESH, range is [0,1e+10]

#### Parameters

##### selector\_rdo\_thresh

`number`

#### Returns

`void`

***

### setSliceSourceImage()

> **setSliceSourceImage**(`sliceIndex`, `imageBuffer`, `width`, `height`, `type`): `void`

Defined in: [type.ts:13](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L13)

Sets the slice's source image, either from a PNG file or from a raw 32-bit RGBA raster image.
The first texel is the top-left texel. The texel byte order in memory is R,G,B,A (R first at offset 0, A last at offset 3).

#### Parameters

##### sliceIndex

`number`

sliceIndex is the slice to change. Valid range is [0,BASISU_MAX_SLICES-1].

##### imageBuffer

`Uint8Array`

png image buffer or 32bit RGBA raster image buffer

##### width

`number`

if isPNG is true, width set 0.

##### height

`number`

if isPNG is true, height set 0.

##### type

[`SourceType`](../enumerations/SourceType.md)

type of the input source.

#### Returns

`void`

***

### setTexType()

> **setTexType**(`texType`): `void`

Defined in: [type.ts:36](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L36)

Sets the basis texture type, default is cBASISTexType2D

#### Parameters

##### texType

[`BasisTextureType`](../enumerations/BasisTextureType.md)

texType is enum BasisTextureType

#### Returns

`void`

***

### setUASTC()

> **setUASTC**(`isUASTC`): `void`

Defined in: [type.ts:31](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L31)

If true, the encoder will output a UASTC texture, otherwise a ETC1S texture.

#### Parameters

##### isUASTC

`boolean`

#### Returns

`void`

***

### setYFlip()

> **setYFlip**(`isYFlip`): `void`

Defined in: [type.ts:44](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L44)

If true the source images will be Y flipped before compression.

#### Parameters

##### isYFlip

`boolean`

#### Returns

`void`
