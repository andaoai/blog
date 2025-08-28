import { defineClientConfig } from '@vuepress/client'
import AIDemo from './components/AIDemo.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('AIDemo', AIDemo)
  },
})
