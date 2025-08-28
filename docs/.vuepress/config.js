import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'My Blog',
  description: 'A VuePress blog built with VuePress 2',

  // GitHub Pages 部署配置
  base: '/blog/',

  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            quietDeps: true,
          }
        }
      }
    }
  }),

  theme: defaultTheme({
    // 导航栏
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: 'AI 相关',
        link: '/ai/',
      },
      {
        text: '生活随笔',
        link: '/life/',
      },
      {
        text: '指南',
        link: '/guide/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/andaoai'
      }
    ],

    // 侧边栏
    sidebar: {
      '/ai/': [
        {
          text: 'AI 相关文章',
          children: [
            '/ai/README.md',
            '/ai/getting-started-with-ai.md',
          ]
        }
      ],
      '/life/': [
        {
          text: '生活随笔',
          children: [
            '/life/README.md',
            '/life/my-coding-journey.md',
          ]
        }
      ],
      '/guide/': [
        {
          text: '指南',
          children: [
            '/guide/README.md',
            '/guide/using-vue.md',
          ]
        }
      ],
    },

    // GitHub 仓库配置
    repo: 'andaoai/blog',

    // 页面元信息
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    docsDir: 'docs',
    docsBranch: 'master',
    lastUpdated: true,
    lastUpdatedText: '最后更新',
    contributors: true,
    contributorsText: '贡献者',
  }),

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
})
