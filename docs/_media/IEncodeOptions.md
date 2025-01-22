[**ktx2-encoder**](../README.md)

***

[ktx2-encoder](../globals.md) / IEncodeOptions

# Interface: IEncodeOptions

Defined in: [type.ts:129](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L129)

## Properties

### compressionLevel

> **compressionLevel**: `number`

Defined in: [type.ts:149](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L149)

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

***

### enableDebug

> **enableDebug**: `boolean`

Defined in: [type.ts:133](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L133)

enable debug output, default is false

***

### generateMipmap

> **generateMipmap**: `boolean`

Defined in: [type.ts:165](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L165)

If true mipmaps will be generated from the source images

***

### imageDecoder()?

> `optional` **imageDecoder**: (`buffer`) => `Promise`\<\{ `data`: `Uint8Array`; `height`: `number`; `width`: `number`; \}\>

Defined in: [type.ts:181](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L181)

Decode compressed image buffer to RGBA imageData.(Required in Node.js)

#### Parameters

##### buffer

`Uint8Array`

#### Returns

`Promise`\<\{ `data`: `Uint8Array`; `height`: `number`; `width`: `number`; \}\>

***

### isKTX2File

> **isKTX2File**: `boolean`

Defined in: [type.ts:169](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L169)

Create .KTX2 files instead of .basis files. By default this is FALSE.

***

### isNormalMap

> **isNormalMap**: `boolean`

Defined in: [type.ts:157](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L157)

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

***

### isSetKTX2SRGBTransferFunc

> **isSetKTX2SRGBTransferFunc**: `boolean`

Defined in: [type.ts:161](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L161)

Input source is sRGB. This should very probably match the "perceptual" setting.

***

### isUASTC

> **isUASTC**: `boolean`

Defined in: [type.ts:137](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L137)

is UASTC texture, default is true

***

### isYFlip

> **isYFlip**: `boolean`

Defined in: [type.ts:141](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L141)

if true the source images will be Y flipped before compression, default is false

***

### jsUrl?

> `optional` **jsUrl**: `string`

Defined in: [type.ts:185](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L185)

js url

***

### kvData

> **kvData**: `Record`\<`string`, `string` \| `Uint8Array`\>

Defined in: [type.ts:172](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L172)

kv data

***

### needSupercompression

> **needSupercompression**: `boolean`

Defined in: [type.ts:153](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L153)

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

***

### qualityLevel

> **qualityLevel**: `number`

Defined in: [type.ts:145](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L145)

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.

***

### type

> **type**: [`SourceType`](../enumerations/SourceType.md)

Defined in: [type.ts:175](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L175)

type

***

### wasmUrl?

> `optional` **wasmUrl**: `string`

Defined in: [type.ts:189](https://github.com/gz65555/ktx2-encoder/blob/7c4de41129ab790944f9dc093b94cea7ef1d2328/src/type.ts#L189)

wasm url
