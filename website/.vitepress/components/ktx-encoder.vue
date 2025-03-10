<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="encoder-container">
        <n-card title="KTX2 Encoder">
          <n-space vertical size="large">
            <div class="upload-section">
              <n-upload accept="image/*,.hdr,.exr" :max="1" @change="handleFileUpload">
                <n-button>Select Image</n-button>
              </n-upload>
              <div v-if="imagePreview" class="preview">
                <img :src="imagePreview" alt="Preview" />
              </div>
            </div>

            <n-form label-placement="left" label-width="160">
              <n-form-item label="Output Type">
                <n-select v-model:value="options.outputType.value" :options="options.outputType.options" />
              </n-form-item>

              <n-form-item label="Generate Mipmaps">
                <n-switch v-model="options.generateMipmap" />
              </n-form-item>

              <n-form-item label="Normal Map">
                <n-switch v-model="options.isNormalMap" />
              </n-form-item>

              <n-form-item label="sRGB Transfer Function">
                <n-switch v-model="options.isSetKTX2SRGBTransferFunc" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'etc1s'" label="Quality Level">
                <NSlider v-model:value="options.qualityLevel" :min="1" :max="255" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'etc1s'" label="Compression Level">
                <NSlider v-model="options.compressionLevel" :min="0" :max="6" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'uastc'" label="Enable Supercompression">
                <n-switch v-model="options.needSupercompression" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'uastc'" label="Quality Level">
                <NSlider v-model:value="options.uastcLDRQualityLevel" :min="0" :max="3" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'uastc'" label="Enable RDO">
                <NSwitch v-model:value="options.enableRDO" />
              </n-form-item>

              <n-form-item
                v-if="options.outputType.value === 'uastc' && options.enableRDO === true"
                label="RDO Quality Level"
              >
                <NSlider v-model="options.rdoQualityLevel" :min="0.1" :max="10" :step="0.1" />
              </n-form-item>

              <n-form-item v-if="options.outputType.value === 'hdr'" label="HDR Quality Level">
                <NSlider v-model="options.hdrQualityLevel" :min="0" :max="3" :step="1" />
              </n-form-item>
            </n-form>

            <div class="actions">
              <NButton type="primary" @click="encode" :loading="loading" :disabled="!imageFile">
                {{ loading ? "Encoding..." : "Encode to KTX2" }}
              </NButton>
            </div>

            <NAlert v-if="error" type="error" :title="error" />
          </n-space>
        </n-card>
      </div>
    </n-message-provider>
  </NConfigProvider>
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
import { ref, defineComponent, computed } from "vue";
import { encodeToKTX2, IEncodeOptions } from "../../../src/web";
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
  NSlider,
  NSelect,
  NMessageProvider,
  createDiscreteApi,
  darkTheme,
  lightTheme,
  GlobalThemeOverrides,
  NConfigProvider
} from "naive-ui";
import { ConfigProviderProps } from "naive-ui";

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
    NSlider,
    NSelect,
    NConfigProvider,
    NCard
  },
  setup() {
    const themeRef = ref<"light" | "dark">("light");
    const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
      theme: themeRef.value === "light" ? lightTheme : darkTheme
    }));

    const { message } = createDiscreteApi(["message"], {
      configProviderProps: configProviderPropsRef
    });

    const themeOverrides: GlobalThemeOverrides = {
      common: {
        primaryColor: "#5672CD",
        primaryColorHover: "#3A5CCC"
        
      }
    };

    const imagePreview = ref("");
    const options = ref({
      outputType: {
        value: ref("uastc"),
        options: [
          {
            label: "UASTC",
            value: "uastc"
          },
          {
            label: "ETC1S",
            value: "etc1s"
          },
          {
            label: "UASTC_HDR",
            value: "hdr"
          }
        ]
      },
      enableRDO: false,
      rdoQualityLevel: 1.0,
      uastcLDRQualityLevel: 1,
      generateMipmap: true,
      needSupercompression: false,
      isNormalMap: false,
      isSetKTX2SRGBTransferFunc: true,
      isKTX2File: true,
      qualityLevel: 128,
      compressionLevel: 2,
      hdrInputType: "hdr",
      hdrQualityLevel: 0
    });
    const loading = ref(false);
    const error = ref("");
    const imageFile = ref<{ arrayBuffer: () => Promise<ArrayBuffer>; name: string } | null>(null);
    return {
      themeOverrides,
      imagePreview,
      loading,
      options,
      error,
      imageFile,
      async encode() {
        if (!imageFile.value) {
          message.error("Please select an image first");
          return;
        }

        try {
          loading.value = true;
          error.value = "";

          imageFile.value;
          const arrayBuffer = await imageFile.value.arrayBuffer();
          let encodeOptions: IEncodeOptions = {};
          const userOptions = options.value;
          switch (userOptions.outputType.value) {
            case "hdr":
              encodeOptions = {
                isHDR: true,
                hdrQualityLevel: userOptions.hdrQualityLevel,
                imageType: userOptions.hdrInputType as any,
                generateMipmap: userOptions.generateMipmap,
                isNormalMap: userOptions.isNormalMap,
                isSetKTX2SRGBTransferFunc: userOptions.isSetKTX2SRGBTransferFunc
              };
              break;
            case "uastc":
              encodeOptions = {
                isHDR: false,
                isUASTC: true,
                needSupercompression: userOptions.needSupercompression,
                uastcLDRQualityLevel: userOptions.uastcLDRQualityLevel,
                enableRDO: userOptions.enableRDO,
                rdoQualityLevel: userOptions.rdoQualityLevel,
                generateMipmap: userOptions.generateMipmap,
                isNormalMap: userOptions.isNormalMap,
                isSetKTX2SRGBTransferFunc: userOptions.isSetKTX2SRGBTransferFunc
              };
              break;
            case "etc1s":
              encodeOptions = {
                isHDR: false,
                isUASTC: false,
                qualityLevel: userOptions.qualityLevel,
                compressionLevel: userOptions.compressionLevel,
                generateMipmap: userOptions.generateMipmap,
                isNormalMap: userOptions.isNormalMap,
                isSetKTX2SRGBTransferFunc: userOptions.isSetKTX2SRGBTransferFunc
              };
              break;
          }
          const ktx2Data = await encodeToKTX2(new Uint8Array(arrayBuffer), encodeOptions);

          // Create and trigger download
          const blob = new Blob([ktx2Data], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = imageFile.value.name.replace(/\.[^/.]+$/, "") + ".ktx2";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          message.success("KTX2 file generated successfully");
        } catch (err) {
          error.value = err.message;
          message.error(err.message);
        } finally {
          loading.value = false;
        }
      },
      handleFileUpload(e: { file: any }) {
        const file = e.file;
        if (!file) return;
        const realFile = file.file as File;
        const filename = realFile.name.toLocaleLowerCase();
        if (filename.endsWith(".hdr")) {
          options.value.outputType.value = "hdr";
          options.value.hdrInputType = "hdr";
        } else if (filename.endsWith(".exr")) {
          options.value.outputType.value = "hdr";
          options.value.hdrInputType = "exr";
        } else {
          options.value.outputType.value = "raster";
          imagePreview.value = URL.createObjectURL(realFile);
        }
        imageFile.value = realFile;

        message.success("Image uploaded successfully");
        return false;
      }
    };
  }
});
</script>
