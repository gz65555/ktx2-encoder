[**ktx2-encoder**](../README.md) • **Docs**

***

[ktx2-encoder](../globals.md) / IBasisEncoder

# Interface: IBasisEncoder

## Constructors

### new IBasisEncoder()

> **new IBasisEncoder**(): [`IBasisEncoder`](IBasisEncoder.md)

#### Returns

[`IBasisEncoder`](IBasisEncoder.md)

#### Defined in

[type.ts:122](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L122)

## Methods

### delete()

> **delete**(): `void`

release memory

#### Returns

`void`

#### Defined in

[type.ts:87](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L87)

***

### encode()

> **encode**(`pngBuffer`): `number`

Compresses the provided source slice(s) to an output .basis file.
At the minimum, you must provided at least 1 source slice by calling setSliceSourceImage() before calling this method.

#### Parameters

• **pngBuffer**: `Uint8Array`

#### Returns

`number`

byte length of encoded data

#### Defined in

[type.ts:26](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L26)

***

### setCompressionLevel()

> **setCompressionLevel**(`level`): `void`

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

#### Parameters

• **level**: `number`

Default is 2, range is [0, 6]

#### Returns

`void`

#### Defined in

[type.ts:60](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L60)

***

### setCreateKTX2File()

> **setCreateKTX2File**(`isKTX2`): `void`

Create .KTX2 files instead of .basis files. By default this is FALSE.

#### Parameters

• **isKTX2**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:70](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L70)

***

### setDebug()

> **setDebug**(`isDebug`): `void`

Enables debug output	to stdout

#### Parameters

• **isDebug**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:49](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L49)

***

### setEndpointRDOThresh()

> **setEndpointRDOThresh**(`endpoint_rdo_thresh`): `void`

Default is BASISU_DEFAULT_ENDPOINT_RDO_THRESH, range is [0,1e+10]

#### Parameters

• **endpoint\_rdo\_thresh**: `number`

#### Returns

`void`

#### Defined in

[type.ts:120](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L120)

***

### setKTX2SRGBTransferFunc()

> **setKTX2SRGBTransferFunc**(`srgbTransferFunc`): `void`

Use sRGB transfer func in the file's DFD. Default is FALSE. This should very probably match the "perceptual" setting.

#### Parameters

• **srgbTransferFunc**: `boolean`

need sRGB transfer func

#### Returns

`void`

#### Defined in

[type.ts:80](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L80)

***

### setKTX2UASTCSupercompression()

> **setKTX2UASTCSupercompression**(`needSupercompression`): `void`

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

#### Parameters

• **needSupercompression**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:40](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L40)

***

### setMaxEndpointClusters()

> **setMaxEndpointClusters**(`max_endpoint_clusters`): `void`

Sets the max # of endpoint clusters for ETC1S mode. Use instead of setQualityLevel.
Default is 512, range is [1, 16128]

#### Parameters

• **max\_endpoint\_clusters**: `number`

#### Returns

`void`

#### Defined in

[type.ts:108](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L108)

***

### setMaxSelectorClusters()

> **setMaxSelectorClusters**(`max_selector_clusters`): `void`

Sets the max # of selectors clusters for ETC1S mode. Use instead of setQualityLevel.
Default is 512, range is [1, 16128]

#### Parameters

• **max\_selector\_clusters**: `number`

#### Returns

`void`

#### Defined in

[type.ts:114](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L114)

***

### setMipGen()

> **setMipGen**(`needGenMipmap`): `void`

If true mipmaps will be generated from the source images

#### Parameters

• **needGenMipmap**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:75](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L75)

***

### setNormalMap()

> **setNormalMap**(`isNormalMap`): `void`

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

#### Parameters

• **isNormalMap**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:65](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L65)

***

### setPerceptual()

> **setPerceptual**(`perceptual`): `void`

If true, the input is assumed to be in sRGB space. Be sure to set this correctly! (Examples: True on photos, albedo/spec maps, and false on normal maps.)

#### Parameters

• **perceptual**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:84](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L84)

***

### setQualityLevel()

> **setQualityLevel**(`level`): `void`

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.
Default is -1 (meaning unused - the compressor will use m_max_endpoint_clusters/m_max_selector_clusters instead to control the codebook sizes).

#### Parameters

• **level**: `number`

Range is [1, 255]

#### Returns

`void`

#### Defined in

[type.ts:55](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L55)

***

### setRDOUASTC()

> **setRDOUASTC**(`rdoUASTC`): `void`

If true, the RDO post-processor will be applied to the encoded UASTC texture data.

#### Parameters

• **rdoUASTC**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:90](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L90)

***

### setRDOUASTCDictSize()

> **setRDOUASTCDictSize**(`dictSize`): `void`

Default is 4096, range is [64, 65535]

#### Parameters

• **dictSize**: `number`

#### Returns

`void`

#### Defined in

[type.ts:96](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L96)

***

### setRDOUASTCMaxAllowedRMSIncreaseRatio()

> **setRDOUASTCMaxAllowedRMSIncreaseRatio**(`rdo_uastc_max_allowed_rms_increase_ratio`): `any`

Default is 10.0f, range is [01, 100.0]

#### Parameters

• **rdo\_uastc\_max\_allowed\_rms\_increase\_ratio**: `number`

#### Returns

`any`

#### Defined in

[type.ts:99](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L99)

***

### setRDOUASTCQualityScalar()

> **setRDOUASTCQualityScalar**(`rdo_quality`): `void`

#### Parameters

• **rdo\_quality**: `number`

#### Returns

`void`

#### Defined in

[type.ts:93](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L93)

***

### setRDOUASTCSkipBlockRMSThresh()

> **setRDOUASTCSkipBlockRMSThresh**(`rdo_uastc_skip_block_rms_thresh`): `any`

Default is 8.0f, range is [.01f, 100.0f]

#### Parameters

• **rdo\_uastc\_skip\_block\_rms\_thresh**: `number`

#### Returns

`any`

#### Defined in

[type.ts:102](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L102)

***

### setSelectorRDOThresh()

> **setSelectorRDOThresh**(`selector_rdo_thresh`): `void`

Default is BASISU_DEFAULT_SELECTOR_RDO_THRESH, range is [0,1e+10]

#### Parameters

• **selector\_rdo\_thresh**: `number`

#### Returns

`void`

#### Defined in

[type.ts:117](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L117)

***

### setSliceSourceImage()

> **setSliceSourceImage**(`sliceIndex`, `imageBuffer`, `width`, `height`, `type`): `void`

Sets the slice's source image, either from a PNG file or from a raw 32-bit RGBA raster image.
The first texel is the top-left texel. The texel byte order in memory is R,G,B,A (R first at offset 0, A last at offset 3).

#### Parameters

• **sliceIndex**: `number`

sliceIndex is the slice to change. Valid range is [0,BASISU_MAX_SLICES-1].

• **imageBuffer**: `Uint8Array`

png image buffer or 32bit RGBA raster image buffer

• **width**: `number`

if isPNG is true, width set 0.

• **height**: `number`

if isPNG is true, height set 0.

• **type**: [`SourceType`](../enumerations/SourceType.md)

type of the input source.

#### Returns

`void`

#### Defined in

[type.ts:13](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L13)

***

### setTexType()

> **setTexType**(`texType`): `void`

Sets the basis texture type, default is cBASISTexType2D

#### Parameters

• **texType**: [`BasisTextureType`](../enumerations/BasisTextureType.md)

texType is enum BasisTextureType

#### Returns

`void`

#### Defined in

[type.ts:36](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L36)

***

### setUASTC()

> **setUASTC**(`isUASTC`): `void`

If true, the encoder will output a UASTC texture, otherwise a ETC1S texture.

#### Parameters

• **isUASTC**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:31](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L31)

***

### setYFlip()

> **setYFlip**(`isYFlip`): `void`

If true the source images will be Y flipped before compression.

#### Parameters

• **isYFlip**: `boolean`

#### Returns

`void`

#### Defined in

[type.ts:44](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L44)
