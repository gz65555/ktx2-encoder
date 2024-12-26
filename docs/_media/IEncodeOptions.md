[**ktx2-encoder**](../README.md)

***

[ktx2-encoder](../globals.md) / IEncodeOptions

# Interface: IEncodeOptions

## Properties

### compressionLevel

> **compressionLevel**: `number`

The compression_level parameter controls the encoder perf vs. file size tradeoff for ETC1S files.

#### Defined in

[type.ts:149](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L149)

***

### enableDebug

> **enableDebug**: `boolean`

enable debug output, default is false

#### Defined in

[type.ts:133](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L133)

***

### generateMipmap

> **generateMipmap**: `boolean`

If true mipmaps will be generated from the source images

#### Defined in

[type.ts:165](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L165)

***

### imageDecoder()?

> `optional` **imageDecoder**: (`buffer`) => `Promise`\<\{ `data`: `Uint8Array`; `height`: `number`; `width`: `number`; \}\>

Decode compressed image buffer to RGBA imageData.(Required in Node.js)

#### Parameters

##### buffer

`Uint8Array`

#### Returns

`Promise`\<\{ `data`: `Uint8Array`; `height`: `number`; `width`: `number`; \}\>

#### Defined in

[type.ts:181](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L181)

***

### isKTX2File

> **isKTX2File**: `boolean`

Create .KTX2 files instead of .basis files. By default this is FALSE.

#### Defined in

[type.ts:169](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L169)

***

### isNormalMap

> **isNormalMap**: `boolean`

setNormalMapMode is the same as the basisu.exe "-normal_map" option. It tunes several codec parameters so compression works better on normal maps.

#### Defined in

[type.ts:157](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L157)

***

### isSetKTX2SRGBTransferFunc

> **isSetKTX2SRGBTransferFunc**: `boolean`

Input source is sRGB. This should very probably match the "perceptual" setting.

#### Defined in

[type.ts:161](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L161)

***

### isUASTC

> **isUASTC**: `boolean`

is UASTC texture, default is true

#### Defined in

[type.ts:137](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L137)

***

### isYFlip

> **isYFlip**: `boolean`

if true the source images will be Y flipped before compression, default is false

#### Defined in

[type.ts:141](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L141)

***

### jsUrl?

> `optional` **jsUrl**: `string`

js url

#### Defined in

[type.ts:185](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L185)

***

### kvData

> **kvData**: `Record`\<`string`, `string` \| `Uint8Array`\>

kv data

#### Defined in

[type.ts:172](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L172)

***

### needSupercompression

> **needSupercompression**: `boolean`

Use UASTC Zstandard supercompression. Defaults to disabled or KTX2_SS_NONE

#### Defined in

[type.ts:153](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L153)

***

### qualityLevel

> **qualityLevel**: `number`

Sets the ETC1S encoder's quality level, which controls the file size vs. quality tradeoff.

#### Defined in

[type.ts:145](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L145)

***

### type

> **type**: [`SourceType`](../enumerations/SourceType.md)

type

#### Defined in

[type.ts:175](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L175)

***

### wasmUrl?

> `optional` **wasmUrl**: `string`

wasm url

#### Defined in

[type.ts:189](https://github.com/gz65555/ktx2-encoder/blob/cca15826f8593d3590205c993a17a51f103fa623/src/type.ts#L189)
