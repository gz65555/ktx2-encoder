[ktx2-encoder](README.md) / Exports

# ktx2-encoder

## Table of contents

### Interfaces

- [IEncodeOptions](interfaces/IEncodeOptions.md)

### Functions

- [encodeKTX2](modules.md#encodektx2)
- [encodeKTX2Cube](modules.md#encodektx2cube)
- [release](modules.md#release)

## Functions

### encodeKTX2

▸ **encodeKTX2**(`pngBuffer`, `options?`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pngBuffer` | `ArrayBuffer` |
| `options` | `Partial`<[`IEncodeOptions`](interfaces/IEncodeOptions.md)\> |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

index.ts:57

___

### encodeKTX2Cube

▸ **encodeKTX2Cube**(`pngBuffers`, `options?`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pngBuffers` | `ArrayBuffer`[] |
| `options` | `Partial`<[`IEncodeOptions`](interfaces/IEncodeOptions.md)\> |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

index.ts:74

___

### release

▸ **release**(): `void`

#### Returns

`void`

#### Defined in

index.ts:149
