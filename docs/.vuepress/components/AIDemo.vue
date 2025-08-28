<template>
  <div class="ai-demo-container">
    <!-- 数据流可视化 -->
    <div class="data-flow-section">
      <h3 class="section-title">🔄 实时数据流</h3>
      <div class="data-stream">
        <div class="data-node" v-for="(node, index) in dataNodes" :key="index" 
             :style="{ left: node.x + 'px', top: node.y + 'px', opacity: node.opacity }">
          {{ node.value }}
        </div>
      </div>
    </div>

    <!-- 模型推理演示 -->
    <div class="model-inference-section">
      <h3 class="section-title">🧠 AI 模型推理</h3>
      <div class="inference-pipeline">
        <div class="pipeline-step" :class="{ active: currentStep >= 1 }">
          <div class="step-icon">📊</div>
          <div class="step-label">数据预处理</div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: step1Progress + '%' }"></div>
          </div>
        </div>
        
        <div class="pipeline-arrow">→</div>
        
        <div class="pipeline-step" :class="{ active: currentStep >= 2 }">
          <div class="step-icon">🤖</div>
          <div class="step-label">神经网络推理</div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: step2Progress + '%' }"></div>
          </div>
        </div>
        
        <div class="pipeline-arrow">→</div>
        
        <div class="pipeline-step" :class="{ active: currentStep >= 3 }">
          <div class="step-icon">📈</div>
          <div class="step-label">结果输出</div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: step3Progress + '%' }"></div>
          </div>
        </div>
      </div>
      
      <!-- 模型性能指标 -->
      <div class="metrics-display">
        <div class="metric">
          <span class="metric-label">准确率</span>
          <span class="metric-value">{{ accuracy.toFixed(2) }}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">推理时间</span>
          <span class="metric-value">{{ inferenceTime }}ms</span>
        </div>
        <div class="metric">
          <span class="metric-label">吞吐量</span>
          <span class="metric-value">{{ throughput }}/s</span>
        </div>
      </div>
    </div>

    <!-- 数据可视化图表 -->
    <div class="visualization-section">
      <h3 class="section-title">📊 实时可视化</h3>
      <div class="charts-container">
        <!-- 损失函数图表 -->
        <div class="chart loss-chart">
          <h4>训练损失</h4>
          <svg width="300" height="150" viewBox="0 0 300 150">
            <polyline 
              :points="lossPoints" 
              fill="none" 
              stroke="#00ff88" 
              stroke-width="2"
            />
            <circle 
              v-for="(point, index) in lossData.slice(-1)" 
              :key="index"
              :cx="290" 
              :cy="150 - point * 140" 
              r="3" 
              fill="#00ff88"
              class="pulse"
            />
          </svg>
        </div>
        
        <!-- 准确率图表 -->
        <div class="chart accuracy-chart">
          <h4>模型准确率</h4>
          <svg width="300" height="150" viewBox="0 0 300 150">
            <polyline 
              :points="accuracyPoints" 
              fill="none" 
              stroke="#ff6b6b" 
              stroke-width="2"
            />
            <circle 
              v-for="(point, index) in accuracyData.slice(-1)" 
              :key="index"
              :cx="290" 
              :cy="150 - point * 140" 
              r="3" 
              fill="#ff6b6b"
              class="pulse"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 神经网络可视化 -->
    <div class="neural-network-section">
      <h3 class="section-title">🕸️ 神经网络结构</h3>
      <div class="network-visualization">
        <div class="layer input-layer">
          <div class="layer-label">输入层</div>
          <div class="neurons">
            <div v-for="i in 4" :key="'input-' + i" class="neuron" :class="{ active: neuronStates.input[i-1] }"></div>
          </div>
        </div>
        
        <div class="layer hidden-layer">
          <div class="layer-label">隐藏层</div>
          <div class="neurons">
            <div v-for="i in 6" :key="'hidden-' + i" class="neuron" :class="{ active: neuronStates.hidden[i-1] }"></div>
          </div>
        </div>
        
        <div class="layer output-layer">
          <div class="layer-label">输出层</div>
          <div class="neurons">
            <div v-for="i in 3" :key="'output-' + i" class="neuron" :class="{ active: neuronStates.output[i-1] }"></div>
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
      // 数据流节点
      dataNodes: [],
      
      // 推理管道状态
      currentStep: 0,
      step1Progress: 0,
      step2Progress: 0,
      step3Progress: 0,
      
      // 性能指标
      accuracy: 95.67,
      inferenceTime: 23,
      throughput: 1247,
      
      // 图表数据
      lossData: [0.8, 0.6, 0.45, 0.35, 0.28, 0.22, 0.18, 0.15, 0.12, 0.10],
      accuracyData: [0.6, 0.72, 0.81, 0.86, 0.89, 0.92, 0.94, 0.95, 0.96, 0.97],
      
      // 神经网络状态
      neuronStates: {
        input: [false, false, false, false],
        hidden: [false, false, false, false, false, false],
        output: [false, false, false]
      },
      
      // 动画定时器
      animationTimers: []
    }
  },
  computed: {
    lossPoints() {
      return this.lossData.map((value, index) => 
        `${index * 30},${150 - value * 140}`
      ).join(' ')
    },
    accuracyPoints() {
      return this.accuracyData.map((value, index) => 
        `${index * 30},${150 - value * 140}`
      ).join(' ')
    }
  },
  mounted() {
    this.startAnimations()
  },
  beforeUnmount() {
    this.animationTimers.forEach(timer => clearInterval(timer))
  },
  methods: {
    startAnimations() {
      // 数据流动画
      this.startDataFlow()
      
      // 推理管道动画
      this.startInferencePipeline()
      
      // 神经网络激活动画
      this.startNeuralNetworkAnimation()
      
      // 实时数据更新
      this.startRealTimeUpdates()
    },
    
    startDataFlow() {
      const timer = setInterval(() => {
        if (this.dataNodes.length > 20) {
          this.dataNodes.shift()
        }
        
        this.dataNodes.push({
          x: Math.random() * 400,
          y: Math.random() * 100,
          value: Math.floor(Math.random() * 100),
          opacity: 1
        })
        
        // 淡出效果
        this.dataNodes.forEach(node => {
          node.opacity *= 0.95
          node.y += 1
        })
      }, 500)
      
      this.animationTimers.push(timer)
    },
    
    startInferencePipeline() {
      const timer = setInterval(() => {
        this.currentStep = 1
        this.step1Progress = 0
        this.step2Progress = 0
        this.step3Progress = 0
        
        // 步骤1动画
        const step1Timer = setInterval(() => {
          this.step1Progress += 10
          if (this.step1Progress >= 100) {
            clearInterval(step1Timer)
            this.currentStep = 2
            
            // 步骤2动画
            const step2Timer = setInterval(() => {
              this.step2Progress += 8
              if (this.step2Progress >= 100) {
                clearInterval(step2Timer)
                this.currentStep = 3
                
                // 步骤3动画
                const step3Timer = setInterval(() => {
                  this.step3Progress += 12
                  if (this.step3Progress >= 100) {
                    clearInterval(step3Timer)
                  }
                }, 50)
              }
            }, 50)
          }
        }, 50)
      }, 5000)
      
      this.animationTimers.push(timer)
    },
    
    startNeuralNetworkAnimation() {
      const timer = setInterval(() => {
        // 随机激活神经元
        Object.keys(this.neuronStates).forEach(layer => {
          this.neuronStates[layer] = this.neuronStates[layer].map(() => 
            Math.random() > 0.7
          )
        })
      }, 800)
      
      this.animationTimers.push(timer)
    },
    
    startRealTimeUpdates() {
      const timer = setInterval(() => {
        // 更新性能指标
        this.accuracy += (Math.random() - 0.5) * 0.1
        this.accuracy = Math.max(90, Math.min(99, this.accuracy))
        
        this.inferenceTime = Math.floor(20 + Math.random() * 10)
        this.throughput = Math.floor(1200 + Math.random() * 100)
        
        // 更新图表数据
        this.lossData.push(Math.max(0.05, this.lossData[this.lossData.length - 1] + (Math.random() - 0.5) * 0.02))
        this.accuracyData.push(Math.min(0.99, this.accuracyData[this.accuracyData.length - 1] + (Math.random() - 0.5) * 0.01))
        
        if (this.lossData.length > 10) this.lossData.shift()
        if (this.accuracyData.length > 10) this.accuracyData.shift()
      }, 2000)
      
      this.animationTimers.push(timer)
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

.section-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #00ff88;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

/* 数据流样式 */
.data-flow-section {
  margin-bottom: 40px;
}

.data-stream {
  height: 120px;
  position: relative;
  background: rgba(0, 255, 136, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.data-node {
  position: absolute;
  background: linear-gradient(45deg, #00ff88, #00cc6a);
  color: #000;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  animation: float 2s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 推理管道样式 */
.model-inference-section {
  margin-bottom: 40px;
}

.inference-pipeline {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.pipeline-step {
  text-align: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.pipeline-step.active {
  opacity: 1;
  transform: scale(1.1);
}

.step-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.step-label {
  font-size: 14px;
  margin-bottom: 10px;
  color: #cccccc;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00cc6a);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
}

.pipeline-arrow {
  font-size: 1.5em;
  color: #00ff88;
  margin: 0 10px;
}

.metrics-display {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.metric {
  text-align: center;
  background: rgba(0, 255, 136, 0.1);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #cccccc;
  margin-bottom: 5px;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #00ff88;
}

/* 可视化图表样式 */
.visualization-section {
  margin-bottom: 40px;
}

.charts-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
}

.chart {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart h4 {
  text-align: center;
  margin-bottom: 15px;
  color: #ffffff;
  font-size: 14px;
}

.pulse {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 神经网络样式 */
.neural-network-section {
  margin-bottom: 20px;
}

.network-visualization {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.layer {
  text-align: center;
}

.layer-label {
  font-size: 14px;
  color: #cccccc;
  margin-bottom: 15px;
}

.neurons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.neuron {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.neuron.active {
  background: #00ff88;
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
  animation: neuronPulse 0.5s ease-in-out;
}

@keyframes neuronPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-demo-container {
    padding: 20px 10px;
  }
  
  .inference-pipeline {
    flex-direction: column;
  }
  
  .pipeline-arrow {
    transform: rotate(90deg);
  }
  
  .charts-container {
    flex-direction: column;
    align-items: center;
  }
  
  .network-visualization {
    flex-direction: column;
  }
}
</style>
