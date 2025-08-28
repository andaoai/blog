<template>
  <div class="ai-demo-container">
    <!-- 神经网络可视化 -->
    <div class="neural-network-section">
      <div class="network-visualization">
        <svg class="connections" :width="svgWidth" :height="svgHeight">
          <!-- 输入层到第一隐藏层的连线 -->
          <g v-for="(inputPos, i) in inputPositions" :key="'input-hidden1-' + i">
            <line
              v-for="(hiddenPos, j) in hidden1Positions"
              :key="'line-input-' + i + '-hidden1-' + j"
              :x1="inputPos.x"
              :y1="inputPos.y"
              :x2="hiddenPos.x"
              :y2="hiddenPos.y"
              class="connection"
              :class="{ active: connectionActivations.inputToHidden1[i] && connectionActivations.inputToHidden1[i][j] > 0 }"
              :style="{ opacity: connectionActivations.inputToHidden1[i] ? connectionActivations.inputToHidden1[i][j] : 0.1 }"
            />
          </g>

          <!-- 第一隐藏层到第二隐藏层的连线 -->
          <g v-for="(hidden1Pos, i) in hidden1Positions" :key="'hidden1-hidden2-' + i">
            <line
              v-for="(hidden2Pos, j) in hidden2Positions"
              :key="'line-hidden1-' + i + '-hidden2-' + j"
              :x1="hidden1Pos.x"
              :y1="hidden1Pos.y"
              :x2="hidden2Pos.x"
              :y2="hidden2Pos.y"
              class="connection"
              :class="{ active: connectionActivations.hidden1ToHidden2[i] && connectionActivations.hidden1ToHidden2[i][j] > 0 }"
              :style="{ opacity: connectionActivations.hidden1ToHidden2[i] ? connectionActivations.hidden1ToHidden2[i][j] : 0.1 }"
            />
          </g>

          <!-- 第二隐藏层到第三隐藏层的连线 -->
          <g v-for="(hidden2Pos, i) in hidden2Positions" :key="'hidden2-hidden3-' + i">
            <line
              v-for="(hidden3Pos, j) in hidden3Positions"
              :key="'line-hidden2-' + i + '-hidden3-' + j"
              :x1="hidden2Pos.x"
              :y1="hidden2Pos.y"
              :x2="hidden3Pos.x"
              :y2="hidden3Pos.y"
              class="connection"
              :class="{ active: connectionActivations.hidden2ToHidden3[i] && connectionActivations.hidden2ToHidden3[i][j] > 0 }"
              :style="{ opacity: connectionActivations.hidden2ToHidden3[i] ? connectionActivations.hidden2ToHidden3[i][j] : 0.1 }"
            />
          </g>

          <!-- 第三隐藏层到输出层的连线 -->
          <g v-for="(hidden3Pos, i) in hidden3Positions" :key="'hidden3-output-' + i">
            <line
              v-for="(outputPos, j) in outputPositions"
              :key="'line-hidden3-' + i + '-output-' + j"
              :x1="hidden3Pos.x"
              :y1="hidden3Pos.y"
              :x2="outputPos.x"
              :y2="outputPos.y"
              class="connection"
              :class="{ active: connectionActivations.hidden3ToOutput[i] && connectionActivations.hidden3ToOutput[i][j] > 0 }"
              :style="{ opacity: connectionActivations.hidden3ToOutput[i] ? connectionActivations.hidden3ToOutput[i][j] : 0.1 }"
            />
          </g>
        </svg>

        <div class="layer input-layer" ref="inputLayer">
          <div class="layer-label">输入层</div>
          <div class="neurons">
            <div
              v-for="i in 6"
              :key="'input-' + i"
              class="neuron input-neuron"
              :class="{ active: neuronStates.input[i-1] > 0 }"
              :style="{ opacity: Math.max(0.2, neuronStates.input[i-1]) }"
              ref="inputNeurons"
            ></div>
          </div>
        </div>

        <div class="layer hidden-layer" ref="hidden1Layer">
          <div class="layer-label">隐藏层1</div>
          <div class="neurons">
            <div
              v-for="i in 10"
              :key="'hidden1-' + i"
              class="neuron hidden-neuron"
              :class="{ active: neuronStates.hidden1[i-1] > 0 }"
              :style="{ opacity: Math.max(0.2, neuronStates.hidden1[i-1]) }"
              ref="hidden1Neurons"
            ></div>
          </div>
        </div>

        <div class="layer hidden-layer" ref="hidden2Layer">
          <div class="layer-label">隐藏层2</div>
          <div class="neurons">
            <div
              v-for="i in 8"
              :key="'hidden2-' + i"
              class="neuron hidden-neuron"
              :class="{ active: neuronStates.hidden2[i-1] > 0 }"
              :style="{ opacity: Math.max(0.2, neuronStates.hidden2[i-1]) }"
              ref="hidden2Neurons"
            ></div>
          </div>
        </div>

        <div class="layer hidden-layer" ref="hidden3Layer">
          <div class="layer-label">隐藏层3</div>
          <div class="neurons">
            <div
              v-for="i in 4"
              :key="'hidden3-' + i"
              class="neuron hidden-neuron"
              :class="{ active: neuronStates.hidden3[i-1] > 0 }"
              :style="{ opacity: Math.max(0.2, neuronStates.hidden3[i-1]) }"
              ref="hidden3Neurons"
            ></div>
          </div>
        </div>

        <div class="layer output-layer" ref="outputLayer">
          <div class="layer-label">输出层</div>
          <div class="neurons">
            <div
              v-for="i in 3"
              :key="'output-' + i"
              class="neuron output-neuron"
              :class="{ active: neuronStates.output[i-1] > 0 }"
              :style="{ opacity: Math.max(0.2, neuronStates.output[i-1]) }"
              ref="outputNeurons"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIDemo',
  data() {
    return {
      // 神经网络状态 (现在存储亮度值 0-1)
      neuronStates: {
        input: [0, 0, 0, 0, 0, 0],
        hidden1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        hidden2: [0, 0, 0, 0, 0, 0, 0, 0],
        hidden3: [0, 0, 0, 0],
        output: [0, 0, 0]
      },

      // 连接权重 (0-1之间的值，表示连接强度)
      connectionWeights: {
        inputToHidden1: [],
        hidden1ToHidden2: [],
        hidden2ToHidden3: [],
        hidden3ToOutput: []
      },

      // 连接激活强度 (当前传播时的激活程度)
      connectionActivations: {
        inputToHidden1: [],
        hidden1ToHidden2: [],
        hidden2ToHidden3: [],
        hidden3ToOutput: []
      },

      // 神经元位置
      inputPositions: [],
      hidden1Positions: [],
      hidden2Positions: [],
      hidden3Positions: [],
      outputPositions: [],

      // SVG 尺寸
      svgWidth: 1000,
      svgHeight: 500,

      // 动画定时器
      animationTimer: null,
      resizeTimer: null,
      propagationTimers: [], // 存储所有传播相关的定时器

      // 性能优化：缓存位置计算结果
      positionsCalculated: false,

      // 性能优化：减少重复计算
      layerSizes: {
        input: 6,
        hidden1: 10,
        hidden2: 8,
        hidden3: 4,
        output: 3
      }
    }
  },
  mounted() {
    this.initializeConnections()
    this.$nextTick(() => {
      // 使用requestAnimationFrame优化初始化
      requestAnimationFrame(() => {
        this.calculatePositions()
        this.startNeuralNetworkAnimation()
      })
    })

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize, { passive: true })
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    initializeConnections() {
      // 性能优化：使用预定义的层大小
      const { input, hidden1, hidden2, hidden3, output } = this.layerSizes

      // 初始化连接权重矩阵 (随机权重 0.1-1.0)
      this.connectionWeights.inputToHidden1 = this.createWeightMatrix(input, hidden1)
      this.connectionWeights.hidden1ToHidden2 = this.createWeightMatrix(hidden1, hidden2)
      this.connectionWeights.hidden2ToHidden3 = this.createWeightMatrix(hidden2, hidden3)
      this.connectionWeights.hidden3ToOutput = this.createWeightMatrix(hidden3, output)

      // 初始化激活矩阵 (全部为0)
      this.connectionActivations.inputToHidden1 = this.createZeroMatrix(input, hidden1)
      this.connectionActivations.hidden1ToHidden2 = this.createZeroMatrix(hidden1, hidden2)
      this.connectionActivations.hidden2ToHidden3 = this.createZeroMatrix(hidden2, hidden3)
      this.connectionActivations.hidden3ToOutput = this.createZeroMatrix(hidden3, output)
    },

    createWeightMatrix(rows, cols) {
      // 性能优化：预生成权重矩阵，减少运行时计算
      const matrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols)
        for (let j = 0; j < cols; j++) {
          matrix[i][j] = Math.random() * 0.9 + 0.1
        }
      }
      return matrix
    },

    createZeroMatrix(rows, cols) {
      // 性能优化：更高效的零矩阵创建
      const matrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0)
      }
      return matrix
    },

    calculatePositions() {
      // 性能优化：避免重复计算
      if (this.positionsCalculated) return

      const layers = ['input', 'hidden1', 'hidden2', 'hidden3', 'output']
      const networkVisualization = this.$el.querySelector('.network-visualization')

      if (!networkVisualization) return

      const networkRect = networkVisualization.getBoundingClientRect()

      layers.forEach((layerName) => {
        const neurons = this.$refs[`${layerName}Neurons`]
        if (neurons && neurons.length) {
          const positions = neurons.map(neuron => {
            const rect = neuron.getBoundingClientRect()
            return {
              x: rect.left - networkRect.left + rect.width / 2,
              y: rect.top - networkRect.top + rect.height / 2
            }
          })
          this[`${layerName}Positions`] = positions
        }
      })

      this.positionsCalculated = true
    },

    startNeuralNetworkAnimation() {
      // 性能优化：增加动画间隔，减少计算频率
      this.animationTimer = setInterval(() => {
        this.simulateNeuralNetworkPropagation()
      }, 3000) // 从2秒改为3秒
    },

    simulateNeuralNetworkPropagation() {
      // 清理之前的定时器
      this.clearPropagationTimers()

      // 重置所有状态
      this.resetAllStates()

      // 性能优化：减少定时器数量，使用更少的延迟
      const timings = [
        { delay: 50, action: () => this.activateInputLayer() },
        { delay: 200, action: () => this.propagateToHidden1() },
        { delay: 400, action: () => this.propagateToHidden2() },
        { delay: 600, action: () => this.propagateToHidden3() },
        { delay: 800, action: () => this.propagateToOutput() }
      ]

      timings.forEach(({ delay, action }) => {
        const timer = setTimeout(action, delay)
        this.propagationTimers.push(timer)
      })
    },

    clearPropagationTimers() {
      // 清理所有传播相关的定时器
      this.propagationTimers.forEach(timer => clearTimeout(timer))
      this.propagationTimers = []
    },

    resetAllStates() {
      // 重置神经元状态为0
      Object.keys(this.neuronStates).forEach(layer => {
        this.neuronStates[layer].fill(0)
      })

      // 重置连接激活状态 (权重保持不变)
      Object.values(this.connectionActivations).forEach(connections => {
        connections.forEach(row => row.fill(0))
      })
    },

    activateInputLayer() {
      // 性能优化：预生成随机亮度值
      const brightnesses = [0.8, 0.5, 0.9, 0.6, 0.7, 0.4] // 预设亮度值

      for (let i = 0; i < this.neuronStates.input.length; i++) {
        this.neuronStates.input[i] = brightnesses[i] || (Math.random() * 0.7 + 0.3)
      }
    },

    propagateToHidden1() {
      this.propagateBetweenLayers(
        this.neuronStates.input,
        this.neuronStates.hidden1,
        this.connectionActivations.inputToHidden1,
        this.connectionWeights.inputToHidden1,
        { min: 2, max: 4 }
      )
    },

    propagateToHidden2() {
      this.propagateBetweenLayers(
        this.neuronStates.hidden1,
        this.neuronStates.hidden2,
        this.connectionActivations.hidden1ToHidden2,
        this.connectionWeights.hidden1ToHidden2,
        { min: 1, max: 3 }
      )
    },

    propagateToHidden3() {
      this.propagateBetweenLayers(
        this.neuronStates.hidden2,
        this.neuronStates.hidden3,
        this.connectionActivations.hidden2ToHidden3,
        this.connectionWeights.hidden2ToHidden3,
        { min: 1, max: 2 }
      )
    },

    propagateToOutput() {
      this.propagateBetweenLayers(
        this.neuronStates.hidden3,
        this.neuronStates.output,
        this.connectionActivations.hidden3ToOutput,
        this.connectionWeights.hidden3ToOutput,
        true // 标记为输出层
      )
    },

    propagateBetweenLayers(sourceLayer, targetLayer, activations, weights, layerConfig = false) {
      // 性能优化：预计算激活的源神经元
      const activeSources = []
      sourceLayer.forEach((strength, i) => {
        if (strength > 0) {
          activeSources.push({ index: i, strength })
        }
      })

      // 性能优化：批量计算连接激活
      activeSources.forEach(({ index: i, strength }) => {
        for (let j = 0; j < targetLayer.length; j++) {
          activations[i][j] = weights[i][j] * strength
        }
      })

      // 性能优化：减少延迟时间
      const timer = setTimeout(() => {
        // 性能优化：预计算目标神经元的输入
        const targetInputs = new Array(targetLayer.length).fill(0)

        activeSources.forEach(({ index: i }) => {
          for (let j = 0; j < targetLayer.length; j++) {
            targetInputs[j] += activations[i][j]
          }
        })

        // 性能优化：批量更新目标神经元
        const isOutputLayer = layerConfig === true
        if (isOutputLayer) {
          // 输出层：找到最大值索引
          let maxValue = 0
          let maxIndex = 0
          targetInputs.forEach((input, j) => {
            const brightness = input * 0.3 + 0.1
            targetLayer[j] = brightness
            if (brightness > maxValue) {
              maxValue = brightness
              maxIndex = j
            }
          })

          // 设置最亮的神经元
          targetLayer[maxIndex] = 1.0
          for (let j = 0; j < targetLayer.length; j++) {
            if (j !== maxIndex) {
              targetLayer[j] = Math.random() * 0.3 + 0.1
            }
          }
        } else {
          // 隐藏层：创建明显的亮度对比，2-3个亮的，其他较暗
          const layerSize = targetInputs.length
          const brightCount = Math.min(Math.floor(layerSize * 0.3) + 1, 3) // 2-3个亮的

          // 计算每个神经元的权重分数
          const neuronScores = targetInputs.map((input, index) => ({
            index,
            score: input + Math.random() * 0.3 // 输入强度 + 随机因子
          }))

          // 按分数排序，选出最亮的几个
          neuronScores.sort((a, b) => b.score - a.score)

          targetInputs.forEach((_, j) => {
            const rank = neuronScores.findIndex(item => item.index === j)

            if (rank < brightCount) {
              // 前2-3个：明亮神经元 (0.7-1.0)
              targetLayer[j] = 0.7 + Math.random() * 0.3
            } else {
              // 其他：较暗神经元 (0.2-0.4)
              targetLayer[j] = 0.2 + Math.random() * 0.2
            }
          })
        }
      }, 100) // 减少延迟时间

      this.propagationTimers.push(timer)
    },

    handleResize() {
      // 防抖处理
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.positionsCalculated = false // 重置位置计算标志
        this.calculatePositions()
      }, 100)
    },

    cleanup() {
      // 性能优化：统一清理所有定时器和事件监听器
      if (this.animationTimer) {
        clearInterval(this.animationTimer)
        this.animationTimer = null
      }

      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
        this.resizeTimer = null
      }

      this.clearPropagationTimers()
      window.removeEventListener('resize', this.handleResize)
    }
  }
}
</script>

<style scoped>
.ai-demo-container {
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  padding: 40px 20px;
  border-radius: 15px;
  margin: 40px 0;
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1);
  position: relative;
  overflow: hidden;
}

.ai-demo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 神经网络样式 */
.neural-network-section {
  margin-bottom: 20px;
  position: relative;
}

.network-visualization {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  min-height: 400px;
  padding: 20px;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.connection {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
  transition: opacity 0.2s ease; /* 只过渡透明度 */
  will-change: opacity; /* 优化GPU加速 */
}

.connection.active {
  stroke: #4fc3f7;
  stroke-width: 2;
  filter: drop-shadow(0 0 3px rgba(79, 195, 247, 0.6));
  animation: connectionPulse 0.5s ease-in-out;
}

@keyframes connectionPulse {
  0% { stroke-width: 2; }
  50% { stroke-width: 3; }
  100% { stroke-width: 2; }
}

.layer {
  text-align: center;
  position: relative;
  z-index: 2;
}

.layer-label {
  font-size: 14px;
  color: #cccccc;
  margin-bottom: 15px;
  font-weight: 500;
}

.neurons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.neuron {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: opacity 0.2s ease; /* 只过渡透明度，减少重绘 */
  position: relative;
  will-change: opacity; /* 优化GPU加速 */
}

/* 移除固定的绿色样式，使用动态颜色 */

.neuron::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.neuron.active::before {
  opacity: 1;
  background: rgba(255, 255, 255, 0.9);
}

@keyframes neuronPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 神经元颜色由JavaScript动态设置 */

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-demo-container {
    padding: 20px 10px;
  }

  .network-visualization {
    flex-direction: column;
    gap: 20px;
    min-height: auto;
  }

  .connections {
    display: none;
  }

  .neurons {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
