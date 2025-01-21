<script setup>
import { ref } from 'vue'
import { encodeToKTX2 } from 'ktx2-encoder'
import {
  NCard,
  NUpload,
  NSwitch,
  NInputNumber,
  NButton,
  NSpace,
  NAlert,
  NForm,
  NFormItem,
  useMessage
} from 'naive-ui'

const message = useMessage()
const imageFile = ref(null)
const imagePreview = ref('')
const options = ref({
  isUASTC: false,
  generateMipmap: true,
  needSupercompression: false,
  isNormalMap: false,
  isSetKTX2SRGBTransferFunc: true,
  isKTX2File: true,
  qualityLevel: 128,
  compressionLevel: 2
})
const loading = ref(false)
const error = ref('')

function handleFileUpload(e) {
  const file = e.file
  if (!file) return
  
  imageFile.value = file.file
  imagePreview.value = URL.createObjectURL(file.file)
  message.success('Image uploaded successfully')
  return false
}

async function encode() {
  if (!imageFile.value) {
    message.error('Please select an image first')
    return
  }

  try {
    loading.value = true
    error.value = ''

    const arrayBuffer = await imageFile.value.arrayBuffer()
    const ktx2Data = await encodeToKTX2(arrayBuffer, options.value)

    // Create and trigger download
    const blob = new Blob([ktx2Data], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = imageFile.value.name.replace(/\.[^/.]+$/, '') + '.ktx2'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('KTX2 file generated successfully')

  } catch (err) {
    error.value = err.message
    message.error(err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="encoder-container">
    <NCard title="KTX2 Encoder">
      <NSpace vertical size="large">
        <div class="upload-section">
          <NUpload
            accept="image/*"
            :max="1"
            @change="handleFileUpload"
          >
            <NButton>Select Image</NButton>
          </NUpload>
          <div v-if="imagePreview" class="preview">
            <img :src="imagePreview" alt="Preview">
          </div>
        </div>

        <NForm label-placement="left" label-width="160">
          <NFormItem label="Use UASTC">
            <NSwitch v-model="options.isUASTC" />
          </NFormItem>

          <NFormItem label="Generate Mipmaps">
            <NSwitch v-model="options.generateMipmap" />
          </NFormItem>

          <NFormItem label="Enable Supercompression">
            <NSwitch v-model="options.needSupercompression" />
          </NFormItem>

          <NFormItem label="Normal Map">
            <NSwitch v-model="options.isNormalMap" />
          </NFormItem>

          <NFormItem label="sRGB Transfer Function">
            <NSwitch v-model="options.isSetKTX2SRGBTransferFunc" />
          </NFormItem>

          <NFormItem label="Quality Level">
            <NInputNumber 
              v-model="options.qualityLevel"
              :min="1"
              :max="255"
            />
          </NFormItem>

          <NFormItem label="Compression Level">
            <NInputNumber 
              v-model="options.compressionLevel"
              :min="0"
              :max="6"
            />
          </NFormItem>
        </NForm>

        <div class="actions">
          <NButton
            type="primary"
            @click="encode"
            :loading="loading"
            :disabled="!imageFile"
          >
            {{ loading ? 'Encoding...' : 'Encode to KTX2' }}
          </NButton>
        </div>

        <NAlert
          v-if="error"
          type="error"
          :title="error"
        />
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped>
.encoder-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.preview {
  margin-top: 20px;
  max-width: 300px;
}

.preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: center;
}
</style> 