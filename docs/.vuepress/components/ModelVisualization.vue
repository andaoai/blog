<template>
  <div class="model-visualization-container">
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
  name: 'ModelVisualization',
  data() {
    return {
      // 神经元状态
      neuronStates: {
        input: new Array(6).fill(0),
        hidden1: new Array(10).fill(0),
        hidden2: new Array(8).fill(0),
        hidden3: new Array(4).fill(0),
        output: new Array(3).fill(0)
      },

      // 连接激活状态
      connectionActivations: {
        inputToHidden1: [],
        hidden1ToHidden2: [],
        hidden2ToHidden3: [],
        hidden3ToOutput: []
      },

      // 连接权重
      connectionWeights: {
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
      // 使用多重延迟确保DOM完全渲染
      setTimeout(() => {
        this.calculatePositions()
        // 再次延迟确保位置计算完成
        setTimeout(() => {
          this.startNeuralNetworkAnimation()
        }, 100)
      }, 100)
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

      // 初始化连接权重和激活状态
      this.connectionWeights.inputToHidden1 = this.createWeightMatrix(input, hidden1)
      this.connectionWeights.hidden1ToHidden2 = this.createWeightMatrix(hidden1, hidden2)
      this.connectionWeights.hidden2ToHidden3 = this.createWeightMatrix(hidden2, hidden3)
      this.connectionWeights.hidden3ToOutput = this.createWeightMatrix(hidden3, output)

      this.connectionActivations.inputToHidden1 = this.createActivationMatrix(input, hidden1)
      this.connectionActivations.hidden1ToHidden2 = this.createActivationMatrix(hidden1, hidden2)
      this.connectionActivations.hidden2ToHidden3 = this.createActivationMatrix(hidden2, hidden3)
      this.connectionActivations.hidden3ToOutput = this.createActivationMatrix(hidden3, output)
    },

    createWeightMatrix(rows, cols) {
      // 性能优化：预分配数组大小
      const matrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols)
        for (let j = 0; j < cols; j++) {
          matrix[i][j] = Math.random() * 0.5 + 0.5 // 权重在0.5-1.0之间
        }
      }
      return matrix
    },

    createActivationMatrix(rows, cols) {
      // 性能优化：预分配数组大小
      const matrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0)
      }
      return matrix
    },

    calculatePositions() {
      // 等待DOM完全渲染
      this.$nextTick(() => {
        const networkContainer = this.$el.querySelector('.network-visualization')
        if (!networkContainer) return

        const containerRect = networkContainer.getBoundingClientRect()

        const layers = [
          { ref: 'inputLayer', neurons: 'inputNeurons', positions: 'inputPositions', count: 6 },
          { ref: 'hidden1Layer', neurons: 'hidden1Neurons', positions: 'hidden1Positions', count: 10 },
          { ref: 'hidden2Layer', neurons: 'hidden2Neurons', positions: 'hidden2Positions', count: 8 },
          { ref: 'hidden3Layer', neurons: 'hidden3Neurons', positions: 'hidden3Positions', count: 4 },
          { ref: 'outputLayer', neurons: 'outputNeurons', positions: 'outputPositions', count: 3 }
        ]

        layers.forEach(layer => {
          const layerElement = this.$refs[layer.ref]
          const neurons = this.$refs[layer.neurons]

          if (layerElement && neurons && neurons.length > 0) {
            this[layer.positions] = neurons.map(neuron => {
              const neuronRect = neuron.getBoundingClientRect()
              return {
                x: neuronRect.left + neuronRect.width / 2 - containerRect.left,
                y: neuronRect.top + neuronRect.height / 2 - containerRect.top
              }
            })
          }
        })

        // 更新SVG尺寸
        this.svgWidth = containerRect.width
        this.svgHeight = containerRect.height
        this.positionsCalculated = true
      })
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

      // 重置连接激活状态
      Object.keys(this.connectionActivations).forEach(connection => {
        this.connectionActivations[connection].forEach(row => row.fill(0))
      })
    },

    activateInputLayer() {
      // 随机激活输入层神经元，创建更自然的输入模式
      const brightnesses = [0.9, 0.7, 0.8, 0.6, 0.85, 0.75]
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
        weights[i].forEach((weight, j) => {
          activations[i][j] = strength * weight * (0.7 + Math.random() * 0.3)
        })
      })

      // 计算目标层神经元的输入
      const targetInputs = new Array(targetLayer.length).fill(0)
      activeSources.forEach(({ index: i, strength }) => {
        weights[i].forEach((weight, j) => {
          targetInputs[j] += strength * weight
        })
      })

      // 延迟激活目标层神经元
      setTimeout(() => {
        const isOutputLayer = layerConfig === true
        if (isOutputLayer) {
          // 输出层：只有一个最亮的神经元
          const maxIndex = targetInputs.indexOf(Math.max(...targetInputs))
          targetInputs.forEach((_, j) => {
            if (j === maxIndex) {
              targetLayer[j] = 0.8 + Math.random() * 0.2 // 最亮神经元
            } else {
              targetLayer[j] = 0.2 + Math.random() * 0.3 // 其他较暗
            }
          })
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
    },

    handleResize() {
      // 性能优化：防抖处理
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }
      this.resizeTimer = setTimeout(() => {
        this.positionsCalculated = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.calculatePositions()
          }, 100)
        })
      }, 250)
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
.model-visualization-container {
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

.model-visualization-container::before {
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
  stroke: rgba(64, 184, 166, 0.2);
  stroke-width: 1;
  transition: all 0.3s ease;
}

.connection.active {
  stroke: rgba(52, 211, 153, 0.8);
  stroke-width: 2;
  filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.6));
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
  color: #40b8a6;
  margin-bottom: 15px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(64, 184, 166, 0.5);
  letter-spacing: 0.5px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 2px solid rgba(64, 184, 166, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(64, 184, 166, 0.1);
}

.neuron::before {
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

.neuron.active {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-color: rgba(52, 211, 153, 0.8);
  box-shadow:
    0 0 20px rgba(52, 211, 153, 0.6),
    0 0 40px rgba(52, 211, 153, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  transform: scale(1.2);
  animation: vue-pulse 2s infinite;
}

.neuron.active::before {
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

/* 不同层的神经元颜色 - Vue绿色主题 */
.input-neuron {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-color: rgba(16, 185, 129, 0.4);
}

.input-neuron.active {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-color: rgba(16, 185, 129, 0.8);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.6),
    0 0 40px rgba(16, 185, 129, 0.3);
}

.hidden-neuron {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-color: rgba(64, 184, 166, 0.3);
}

.hidden-neuron.active {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  border-color: rgba(64, 184, 166, 0.8);
  box-shadow:
    0 0 20px rgba(64, 184, 166, 0.6),
    0 0 40px rgba(64, 184, 166, 0.3);
}

.output-neuron {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-color: rgba(52, 211, 153, 0.4);
}

.output-neuron.active {
  background: linear-gradient(135deg, #34d399 0%, #6ee7b7 100%);
  border-color: rgba(52, 211, 153, 0.9);
  box-shadow:
    0 0 25px rgba(52, 211, 153, 0.8),
    0 0 50px rgba(52, 211, 153, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .model-visualization-container {
    padding: 20px 10px;
    margin: 20px 0;
  }

  .network-visualization {
    gap: 20px;
    min-height: 300px;
    padding: 10px;
  }

  .neuron {
    width: 16px;
    height: 16px;
  }

  .neuron::before {
    width: 6px;
    height: 6px;
  }

  .layer-label {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .neurons {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .network-visualization {
    flex-direction: column;
    gap: 30px;
  }

  .neurons {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .layer {
    width: 100%;
  }
}
</style>
