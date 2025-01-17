import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "KTX2-Encoder",
  description: "A lightweight JavaScript library for converting images to KTX2 format",
  base: '/ktx2-encoder/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'glTF Transform', link: '/guide/gltf-transform' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gz65555/ktx2-encoder' }
    ]
  }
}) 