# Advanced Usage

## Compression Formats

### ETC1S vs UASTC

KTX2-Encoder supports two compression formats:

- **ETC1S**: Better compression ratios, good for most textures
- **UASTC**: Higher quality, better for normal maps and HDR textures

Choose between them using the `isUASTC` option:

```typescript
// Use ETC1S compression
const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: false
});

// Use UASTC compression
const ktx2Data = await encodeToKTX2(imageBuffer, {
  isUASTC: true
});
```

### Quality Settings

For ETC1S compression:

```typescript
const options = {
  isUASTC: false,
  qualityLevel: 128, // Range: 1-255
  compressionLevel: 2 // Range: 0-6
};
```

For UASTC compression:

```typescript
const options = {
  isUASTC: true,
  needSupercompression: true // Enable Zstandard supercompression
};
```

## Node.js Usage

When using in Node.js, you need to provide an image decoder:

```typescript
import sharp from 'sharp';

const imageDecoder = async (buffer: Uint8Array) => {
  const { data, info } = await sharp(buffer)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
    
  return {
    data: new Uint8Array(data),
    width: info.width,
    height: info.height
  };
};

const ktx2Data = await encodeToKTX2(pngBuffer, {
  imageDecoder
});
```

## Custom KV Data

You can include custom key-value metadata in the KTX2 file:

```typescript
const ktx2Data = await encodeToKTX2(imageBuffer, {
  kvData: {
    'myKey': 'myValue',
    'customData': new Uint8Array([1, 2, 3])
  }
}); 