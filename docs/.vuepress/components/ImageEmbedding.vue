<template>
  <div class="image-embedding-container">
    <h3 class="section-title">图片嵌入向量化过程</h3>

    <div class="embedding-visualization">
      <!-- 统一的显示区域 -->
      <div class="stage-container">
        <!-- 阶段标签 -->
        <div class="stage-label">{{ currentStageLabel }}</div>

        <!-- 显示区域 -->
        <div class="display-area">
          <!-- 原始图片 -->
          <div v-if="currentStage === 0" class="image-display">
            <img
              ref="originalImage"
              :src="currentImageSrc"
              alt="原始图片"
              class="original-image"
              @load="onImageLoad"
            />
          </div>

          <!-- 图片分块阶段 -->
          <div v-if="currentStage === 1" class="patches-display">
            <div class="patches-container">
              <div
                v-for="(patch, index) in patches"
                :key="`patch-${index}`"
                class="patch"
                :style="getPatchStyle(index)"
                :class="{ 'animated': patchesAnimated }"
              >
                <div class="patch-content" :style="getPatchImageStyle(index)"></div>
              </div>
            </div>
          </div>

          <!-- 转换为圆点阶段 -->
          <div v-if="currentStage === 2" class="dots-display">
            <div class="dots-container">
              <div
                v-for="(dot, index) in dots"
                :key="`dot-${index}`"
                class="feature-dot"
                :style="getDotStyle(index)"
                :class="{ 'animated': dotsAnimated }"
              ></div>
            </div>
          </div>

          <!-- 最终嵌入向量 -->
          <div v-if="currentStage === 3" class="embedding-display">
            <div class="embedding-container">
              <div
                v-for="(value, index) in embeddingVector"
                :key="`embedding-${index}`"
                class="embedding-neuron"
                :class="{ 'animated': embeddingAnimated }"
                :style="{
                  animationDelay: `${index * 100}ms`,
                  opacity: Math.max(0.2, value)
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageEmbedding',
  data() {
    return {
      currentStage: 0,
      images: ['/blog/cat.jpg', '/blog/dog.png'],
      patches: [],
      dots: [],
      embeddingVector: [],
      patchesAnimated: false,
      dotsAnimated: false,
      embeddingAnimated: false,
      animationTimer: null,
      imageLoaded: false
    }
  },
  computed: {
    currentImageSrc() {
      return this.images[0] // 固定使用第一张图片
    },
    currentStageLabel() {
      const labels = ['原始图片', '图片分块', '特征提取', '嵌入向量']
      return labels[this.currentStage] || '原始图片'
    }
  },
  mounted() {
    this.initializeData()
    this.startAnimation()
  },
  beforeUnmount() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer)
    }
  },
  methods: {
    initializeData() {
      // 初始化4x4的图片块
      this.patches = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        row: Math.floor(i / 4),
        col: i % 4
      }))

      // 初始化16个特征点
      this.dots = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        row: Math.floor(i / 4),
        col: i % 4
      }))

      // 初始化8维嵌入向量
      this.embeddingVector = Array.from({ length: 8 }, () => Math.random() * 0.8 + 0.2)
    },

    onImageLoad() {
      this.imageLoaded = true
    },

    resetAnimation() {
      this.currentStage = 0
      this.patchesAnimated = false
      this.dotsAnimated = false
      this.embeddingAnimated = false
      if (this.animationTimer) {
        clearInterval(this.animationTimer)
      }
    },

    startAnimation() {
      this.resetAnimation()

      // 阶段1: 显示图片分块
      setTimeout(() => {
        this.currentStage = 1
        setTimeout(() => {
          this.patchesAnimated = true
        }, 300)
      }, 1000)

      // 阶段2: 转换为圆点
      setTimeout(() => {
        this.currentStage = 2
        setTimeout(() => {
          this.dotsAnimated = true
        }, 300)
      }, 3000)

      // 阶段3: 生成嵌入向量
      setTimeout(() => {
        this.currentStage = 3
        setTimeout(() => {
          this.embeddingAnimated = true
        }, 300)
      }, 5000)

      // 重新生成随机嵌入向量
      setTimeout(() => {
        this.embeddingVector = Array.from({ length: 8 }, () => Math.random() * 0.8 + 0.2)
      }, 5500)

      // 设置循环动画
      this.animationTimer = setInterval(() => {
        this.startAnimation()
      }, 8000)
    },

    getPatchStyle(index) {
      const row = Math.floor(index / 4)
      const col = index % 4
      // 计算在240x240容器中的位置，每个块55x55，间距2px
      const patchSize = 55
      const spacing = 2
      const totalWidth = 4 * patchSize + 3 * spacing
      const totalHeight = 4 * patchSize + 3 * spacing
      const offsetX = (240 - totalWidth) / 2
      const offsetY = (240 - totalHeight) / 2

      return {
        left: `${offsetX + col * (patchSize + spacing)}px`,
        top: `${offsetY + row * (patchSize + spacing)}px`,
        animationDelay: `${index * 50}ms`
      }
    },

    getPatchImageStyle(index) {
      const row = Math.floor(index / 4)
      const col = index % 4
      return {
        backgroundImage: `url(${this.currentImageSrc})`,
        backgroundPosition: `-${col * (240/4)}px -${row * (240/4)}px`,
        backgroundSize: '240px 240px'
      }
    },

    getDotStyle(index) {
      const row = Math.floor(index / 4)
      const col = index % 4
      // 计算在240x240容器中的位置，每个点20x20，间距15px
      const dotSize = 20
      const spacing = 15
      const totalWidth = 4 * dotSize + 3 * spacing
      const totalHeight = 4 * dotSize + 3 * spacing
      const offsetX = (240 - totalWidth) / 2
      const offsetY = (240 - totalHeight) / 2

      return {
        left: `${offsetX + col * (dotSize + spacing)}px`,
        top: `${offsetY + row * (dotSize + spacing)}px`,
        animationDelay: `${index * 30}ms`
      }
    }
  }
}
</script>

<style scoped>
.image-embedding-container {
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  color: #ffffff;
  padding: 40px 20px;
  border-radius: 15px;
  margin: 40px 0;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(64, 184, 166, 0.1);
  border: 1px solid rgba(64, 184, 166, 0.2);
  position: relative;
  overflow: hidden;
}

.image-embedding-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(64, 184, 166, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(52, 211, 153, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.section-title {
  text-align: center;
  color: #40b8a6;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(64, 184, 166, 0.5);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.embedding-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  position: relative;
  z-index: 1;
}

.stage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.stage-label {
  color: #40b8a6;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 0 10px rgba(64, 184, 166, 0.5);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  transition: all 0.5s ease;
}

.display-area {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 各个显示阶段 */
.image-display,
.patches-display,
.dots-display,
.embedding-display {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: stageAppear 0.8s ease forwards;
}

@keyframes stageAppear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 原始图片 */
.original-image {
  width: 240px;
  height: 240px;
  border-radius: 15px;
  object-fit: cover;
  border: 2px solid rgba(64, 184, 166, 0.3);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* 分块阶段 */
.patches-container {
  position: relative;
  width: 240px;
  height: 240px;
}

.patch {
  position: absolute;
  width: 55px;
  height: 55px;
  border: 2px solid rgba(64, 184, 166, 0.3);
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
  transform-origin: center;
}

.patch.animated {
  animation: patchAppear 0.8s ease forwards;
}

.patch-content {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}

@keyframes patchAppear {
  0% {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) rotate(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* 圆点阶段 */
.dots-container {
  position: relative;
  width: 240px;
  height: 240px;
}

.feature-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 2px solid rgba(64, 184, 166, 0.3);
  opacity: 0;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(64, 184, 166, 0.1);
}

.feature-dot.animated {
  animation: dotTransform 1.2s ease forwards;
}

@keyframes dotTransform {
  0% {
    opacity: 0;
    transform: scale(0);
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  }
  30% {
    opacity: 1;
    transform: scale(1.3);
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    border-color: rgba(52, 211, 153, 0.8);
    box-shadow:
      0 0 20px rgba(52, 211, 153, 0.6),
      0 0 40px rgba(52, 211, 153, 0.3);
  }
  70% {
    opacity: 1;
    transform: scale(1);
    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
    border-color: rgba(64, 184, 166, 0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
    border-color: rgba(64, 184, 166, 0.8);
    box-shadow:
      0 0 20px rgba(64, 184, 166, 0.6),
      0 0 40px rgba(64, 184, 166, 0.3);
  }
}

/* 嵌入向量阶段 */
.embedding-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.embedding-neuron {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 2px solid rgba(64, 184, 166, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(64, 184, 166, 0.1);
  opacity: 0;
  transform: scale(0);
}

.embedding-neuron::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(64, 184, 166, 0.4);
  transition: all 0.3s ease;
}

.embedding-neuron.animated {
  animation: embeddingAppear 0.8s ease forwards;
}

@keyframes embeddingAppear {
  0% {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
  50% {
    transform: scale(1.3) rotate(90deg);
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    border-color: rgba(52, 211, 153, 0.8);
    box-shadow:
      0 0 20px rgba(52, 211, 153, 0.6),
      0 0 40px rgba(52, 211, 153, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    border-color: rgba(52, 211, 153, 0.8);
    box-shadow:
      0 0 20px rgba(52, 211, 153, 0.6),
      0 0 40px rgba(52, 211, 153, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
    animation: vue-pulse 2s infinite;
  }
}

.embedding-neuron.animated::before {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

/* Vue风格的脉冲动画 */
@keyframes vue-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
}



/* 响应式设计 */
@media (max-width: 768px) {
  .embedding-visualization {
    flex-direction: column;
    gap: 30px;
  }

  .image-container, .patches-container, .dots-container {
    width: 200px;
    height: 200px;
  }

  .patch {
    width: 45px;
    height: 45px;
  }

  .feature-dot {
    width: 16px;
    height: 16px;
  }

  .embedding-neuron {
    width: 16px;
    height: 16px;
  }

  .embedding-neuron::before {
    width: 4px;
    height: 4px;
  }
}
</style>
