<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="encoder-container">
        <n-card title="KTX2 Cubemap Encoder">
          <n-space vertical size="large">
            <div class="upload-section">
              <n-upload accept="image/*" :max="6" :multiple="true" :show-file-list="true" @change="handleFilesUpload">
                <n-button>Select 6 Faces (posx, negx, posy, negy, posz, negz)</n-button>
              </n-upload>
              <div v-if="previews.length" class="preview-grid">
                <div v-for="(src, i) in previews" :key="i" class="preview">
                  <img :src="src" :alt="faceOrder[i]" />
                  <div class="caption">{{ faceOrder[i] }}</div>
                </div>
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
            </n-form>

            <div class="actions">
              <NButton type="primary" @click="encode" :loading="loading" :disabled="!isFacesReady">
                {{ loading ? "Encoding..." : "Encode to KTX2 (Cubemap)" }}
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.preview-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-gap: 12px;
}

.preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.caption {
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: #666;
}

.actions {
  display: flex;
  justify-content: center;
}
</style>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import { encodeToKTX2, IEncodeOptions, CubeBufferData } from "../../../src/web";
import {
  NCard,
  NUpload,
  NSwitch,
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

    const faceOrder = ["posx", "negx", "posy", "negy", "posz", "negz"];
    const filesMap = ref<Record<string, File | null>>({
      posx: null,
      negx: null,
      posy: null,
      negy: null,
      posz: null,
      negz: null
    });
    const previews = ref<string[]>([]);

    const options = ref({
      outputType: {
        value: ref("uastc"),
        options: [
          { label: "UASTC", value: "uastc" },
          { label: "ETC1S", value: "etc1s" }
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
      compressionLevel: 2
    });

    const loading = ref(false);
    const error = ref("");

    const isFacesReady = computed(() => faceOrder.every((k) => !!filesMap.value[k]));

    return {
      themeOverrides,
      loading,
      options,
      error,
      previews,
      faceOrder,
      isFacesReady,
      async encode() {
        if (!isFacesReady.value) {
          message.error("Please upload all 6 faces: posx, negx, posy, negy, posz, negz");
          return;
        }
        try {
          loading.value = true;
          error.value = "";

          const buffers: Uint8Array[] = [];
          for (const key of faceOrder) {
            const file = filesMap.value[key]!;
            const ab = await file.arrayBuffer();
            buffers.push(new Uint8Array(ab));
          }

          const userOptions = options.value as any;
          let encodeOptions: IEncodeOptions = {} as any;
          switch (userOptions.outputType.value) {
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

          const ktx2Data = await encodeToKTX2(buffers as CubeBufferData, encodeOptions);

          const blob = new Blob([ktx2Data], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "cubemap.ktx2";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          message.success("KTX2 cubemap generated successfully");
        } catch (err: any) {
          error.value = err.message ?? String(err);
          message.error(error.value);
        } finally {
          loading.value = false;
        }
      },
      async handleFilesUpload(e: { fileList: any[] }) {
        previews.value = [];
        filesMap.value = { posx: null, negx: null, posy: null, negy: null, posz: null, negz: null };

        const list = (e.fileList || []).map((i) => i.file as File).filter(Boolean);
        for (const f of list) {
          const name = f.name.toLowerCase();
          for (const face of faceOrder) {
            if (name.includes(face)) {
              filesMap.value[face] = f;
            }
          }
        }

        const urls: string[] = [];
        for (const face of faceOrder) {
          const f = filesMap.value[face];
          if (f) urls.push(URL.createObjectURL(f));
        }
        previews.value = urls;

        if (isFacesReady.value) {
          message.success("All 6 faces loaded");
        }
      }
    };
  }
});
</script>
