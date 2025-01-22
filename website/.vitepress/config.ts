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
      { text: 'Guide', link: '/guide/' },
      { text: 'Tools', link: '/tools/' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'glTF Transform', link: '/guide/gltf-transform' },
          { text: 'API', link: '/guide/api' }
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: 'KTX2 Encoder', link: '/tools/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gz65555/ktx2-encoder' }
    ]
  }
}) 