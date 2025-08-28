import { defineClientConfig } from '@vuepress/client'
import ModelVisualization from './components/ModelVisualization.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('ModelVisualization', ModelVisualization)
  },
})
