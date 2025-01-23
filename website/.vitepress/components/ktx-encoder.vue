<template>
  <n-message-provider>
    <div class="encoder-container">
      <n-card title="KTX2 Encoder">
        <n-space vertical size="large">
          <div class="upload-section">
            <n-upload accept="image/*" :max="1" @change="handleFileUpload">
              <n-button>Select Image</n-button>
            </n-upload>
            <div v-if="imagePreview" class="preview">
              <img :src="imagePreview" alt="Preview">
            </div>
          </div>

          <n-form label-placement="left" label-width="160">
            <n-form-item label="Use UASTC">
              <n-switch v-model="options.isUASTC" />
            </n-form-item>

            <n-form-item label="Generate Mipmaps">
              <n-switch v-model="options.generateMipmap" />
            </n-form-item>

            <n-form-item label="Enable Supercompression">
              <n-switch v-model="options.needSupercompression" />
            </n-form-item>

            <n-form-item label="Normal Map">
              <n-switch v-model="options.isNormalMap" />
            </n-form-item>

            <n-form-item label="sRGB Transfer Function">
              <n-switch v-model="options.isSetKTX2SRGBTransferFunc" />
            </n-form-item>

            <n-form-item label="Quality Level">
              <NInputNumber v-model="options.qualityLevel" :min="1" :max="255" />
            </n-form-item>

            <n-form-item label="Compression Level">
              <NInputNumber v-model="options.compressionLevel" :min="0" :max="6" />
            </n-form-item>
          </n-form>

          <div class="actions">
            <NButton type="primary" @click="encode" :loading="loading" :disabled="!imageFile">
              {{ loading ? 'Encoding...' : 'Encode to KTX2' }}
            </NButton>
          </div>

          <NAlert v-if="error" type="error" :title="error" />
        </n-space>
      </n-card>
    </div>
  </n-message-provider>
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

<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
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
  useMessage,
  NMessageProvider,
  createDiscreteApi, darkTheme, lightTheme
} from 'naive-ui';
import { ConfigProviderProps } from 'naive-ui';

export default defineComponent({
  components: {
    NButton,
    NMessageProvider,
    NUpload,
    NAlert,
    NForm,
    NFormItem,
    NInputNumber,
    NSpace,
    NSwitch,
    NCard
  },
  setup() {
    const themeRef = ref<'light' | 'dark'>('light')
    const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
      theme: themeRef.value === 'light' ? lightTheme : darkTheme
    }))

    const { message } = createDiscreteApi(
      ['message'],
      {
        configProviderProps: configProviderPropsRef
      }
    )

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
    const imageFile = ref<{ arrayBuffer: () => Promise<ArrayBuffer>, name: string } | null>(null)
    return {
      imagePreview,
      loading,
      options,
      error,
      imageFile,
      async encode() {
        if (!imageFile.value) {
          message.error('Please select an image first')
          return
        }

        try {
          loading.value = true
          error.value = ''

          imageFile.value
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
      },
      handleFileUpload(e) {
        const file = e.file
        if (!file) return

        imageFile.value = file.file
        imagePreview.value = URL.createObjectURL(file.file)
        message.success('Image uploaded successfully')
        return false
      }
    }
  }
})

</script>