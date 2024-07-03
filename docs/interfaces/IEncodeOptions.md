[**ktx2-encoder**](../README.md) • **Docs**

***

[ktx2-encoder](../globals.md) / IEncodeOptions

# Interface: IEncodeOptions

## Properties

### compressionLevel

> **compressionLevel**: `number`

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

#### Defined in

[type.ts:150](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L150)

***

### enableDebug

> **enableDebug**: `boolean`

enable debug output, default is false

#### Defined in

[type.ts:134](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L134)

***

### generateMipmap

> **generateMipmap**: `boolean`

If true mipmaps will be generated from the source images

#### Defined in

[type.ts:166](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L166)

***

### imageDecoder()?

> `optional` **imageDecoder**: (`buffer`) => `Promise`\<`object`\>

#### Parameters

• **buffer**: `Uint8Array`

#### Returns

`Promise`\<`object`\>

##### data

> **data**: `Uint8Array`

##### height

> **height**: `number`

##### width

> **width**: `number`

#### Defined in

[type.ts:182](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L182)

***

### isKTX2File

> **isKTX2File**: `boolean`

Create .KTX2 files instead of .basis files. By default this is FALSE.

#### Defined in

[type.ts:170](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L170)

***

### isNormalMap

> **isNormalMap**: `boolean`

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

#### Defined in

[type.ts:158](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L158)

***

### isSetKTX2SRGBTransferFunc

> **isSetKTX2SRGBTransferFunc**: `boolean`

Input source is sRGB. This should very probably match the "perceptual" setting.

#### Defined in

[type.ts:162](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L162)

***

### isUASTC

> **isUASTC**: `boolean`

is UASTC texture, default is true

#### Defined in

[type.ts:138](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L138)

***

### isYFlip

> **isYFlip**: `boolean`

if true the source images will be Y flipped before compression, default is false

#### Defined in

[type.ts:142](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L142)

***

### kvData

> **kvData**: `Record`\<`string`, `string` \| `Uint8Array`\>

kv data

#### Defined in

[type.ts:173](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L173)

***

### needSupercompression

> **needSupercompression**: `boolean`

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

#### Defined in

[type.ts:154](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L154)

***

### qualityLevel

> **qualityLevel**: `number`

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.

#### Defined in

[type.ts:146](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L146)

***

### type

> **type**: [`SourceType`](../enumerations/SourceType.md)

type

#### Defined in

[type.ts:176](https://github.com/gz65555/ktx2-encoder/blob/391f15a8ca3f2c3fe73e0e7ccf10b89523bc1467/src/type.ts#L176)
