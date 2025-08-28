import { defineClientConfig } from '@vuepress/client'
import ModelVisualization from './components/ModelVisualization.vue'
import ImageEmbedding from './components/ImageEmbedding.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('ModelVisualization', ModelVisualization)
    app.component('ImageEmbedding', ImageEmbedding)
  },
})
