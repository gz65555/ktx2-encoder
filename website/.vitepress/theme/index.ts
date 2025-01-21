import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import naive from "naive-ui";
import { NConfigProvider, NMessageProvider } from "naive-ui";
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
    const route: any = useRoute();
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
        default: () => h(
          NMessageProvider,
          null,
          {
            default: () => [
              h(Layout, null, { default: this.$slots.default?.() }),
              import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null
            ]
          }
        )
      }
    );
  }
});

export default {
  ...DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp({ app }) {
    // Register naive-ui components
    app.use(naive);
  },
  setup() {
    // Create global naive-ui provider
    const meta = document.createElement("meta");
    meta.name = "naive-ui-style";
    document.head.appendChild(meta);
  }
};
