---
title: KTX2 Encoder Tool
---

<script setup>
import KtxEncoder from '../.vitepress/components/ktx-encoder.vue'
</script>

# KTX2 Encoder Tool

Upload an image and convert it to KTX2 format with custom encoding options.

<KtxEncoder />

## Usage Instructions

1. Click the file input to upload an image
2. Configure the encoding options:
   - **UASTC**: Use UASTC format for higher quality (recommended for normal maps)
   - **Generate Mipmaps**: Create mipmaps for better rendering at different distances
   - **Supercompression**: Enable additional compression (Zstandard)
   - **Normal Map**: Optimize encoding for normal maps
   - **sRGB Transfer**: Use sRGB transfer function in the file's DFD
   - **Quality Level**: Controls quality vs file size (1-255)
   - **Compression Level**: Controls compression speed vs file size (0-6)
3. Click "Encode to KTX2" to convert and download the KTX2 file 