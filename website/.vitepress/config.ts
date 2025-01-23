import { defineConfig } from "vitepress";

const fileAndStyles: Record<string, string> = {}

export default defineConfig({
  title: "KTX2-Encoder",
  description: "A lightweight JavaScript library for converting images to KTX2 format",
  base: "/ktx2-encoder/",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "Tools", link: "/tools/" }
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/" },
          { text: "glTF Transform", link: "/guide/gltf-transform" },
          { text: "API", link: "/guide/api" }
        ]
      },
      {
        text: "Tools",
        items: [{ text: "KTX2 Encoder", link: "/tools/" }]
      }
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/gz65555/ktx2-encoder" }]
  },
  // native ui
  vite: {
    ssr: {
      noExternal: ["naive-ui", "date-fns", "vueuc"]
    }
  },
  postRender(context) {
    const styleRegex = /<css-render-style>((.|\s)+)<\/css-render-style>/;
    const vitepressPathRegex = /<vitepress-path>(.+)<\/vitepress-path>/;
    const style = styleRegex.exec(context.content)?.[1];
    const vitepressPath = vitepressPathRegex.exec(context.content)?.[1];
    if (vitepressPath && style) {
      fileAndStyles[vitepressPath] = style;
    }
    context.content = context.content.replace(styleRegex, "");
    context.content = context.content.replace(vitepressPathRegex, "");
  },
  transformHtml(code, id) {
    const html = id.split("/").pop();
    if (!html) return;
    const style = fileAndStyles[`/${html}`];
    if (style) {
      return code.replace(/<\/head>/, `${style}</head>`);
    }
  }
});
