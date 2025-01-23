// .vitepress/theme/index.js

import { setup } from "@css-render/vue3-ssr";
import { NConfigProvider } from "naive-ui";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { defineComponent, h, inject } from "vue";

const { Layout } = DefaultTheme;

const CssRenderStyle = defineComponent({
  setup() {
    const collect: any = inject("css-render-collect");
    return {
      style: collect()
    };
  },
  render() {
    return h("css-render-style", {
      innerHTML: this.style
    });
  }
});

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute();
    return () => {
      return h("vitepress-path", null, [route.path]);
    };
  }
});

const NaiveUIProvider = defineComponent({
  render() {
    return h(
      NConfigProvider,
      { abstract: true, inlineThemeDisabled: true },
      {
        default: () => [
          h(Layout, null, { default: this.$slots.default?.() }),
          // @ts-ignore
          import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null
        ]
      }
    );
  }
});

export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app }) => {
    // @ts-ignore
    if (import.meta.env.SSR) {
      const { collect } = setup(app);
      app.provide("css-render-collect", collect);
    }
  }
};
