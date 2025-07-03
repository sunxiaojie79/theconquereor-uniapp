<template>
  <view class="page">
    <!-- 今日运动数据卡片 -->
    <view class="today-card">
      <view class="card-header">
        <text class="card-title">今日运动数据</text>
        <text class="date">{{ currentDate }}</text>
      </view>
      <view class="sports-grid">
        <view class="sports-item">
          <text class="value">{{ todaySteps }}</text>
          <text class="label">步数</text>
        </view>
        <view class="sports-item">
          <text class="value">{{ todayDistance }}</text>
          <text class="label">公里</text>
        </view>
        <view class="sports-item">
          <text class="value">{{ todayCalories }}</text>
          <text class="label">卡路里</text>
        </view>
      </view>
    </view>

    <!-- 挑战进度 -->
    <view class="challenges-section">
      <view class="section-header">
        <text class="section-title">挑战进度</text>
        <text class="view-all" @click="navigateTo('/pages/challenge-square/index')">查看全部</text>
      </view>
      <view class="challenge-progress-list">
        <view 
          v-for="challenge in activeChallenges" 
          :key="challenge.challengeId"
          class="progress-item"
        >
          <view class="progress-header">
            <text class="challenge-name">{{ challenge.challenge.name }}</text>
            <text class="progress-text">{{ challenge.progress }}%</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{width: challenge.progress + '%'}"></view>
          </view>
          <view class="progress-stats">
            <text class="stat">已完成 {{ challenge.currentDistance }}/{{ challenge.challenge.totalDistance }} 公里</text>
            <text class="stat">预计还需{{ calculateDaysLeft(challenge) }}天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 运动趋势 -->
    <view class="trend-section">
      <view class="section-header">
        <text class="section-title">本周运动趋势</text>
        <view class="period-tabs">
          <text 
            class="period-tab"
            :class="{ active: selectedPeriod === 'week' }"
            @click="selectedPeriod = 'week'"
          >周</text>
          <text 
            class="period-tab active"
            :class="{ active: selectedPeriod === 'month' }"
            @click="selectedPeriod = 'month'"
          >月</text>
          <text 
            class="period-tab"
            :class="{ active: selectedPeriod === 'year' }"
            @click="selectedPeriod = 'year'"
          >年</text>
        </view>
      </view>
      
      <!-- 简单的图表展示 -->
      <view class="chart-container">
        <view class="chart">
          <view 
            v-for="(day, index) in weeklyData" 
            :key="index"
            class="chart-bar"
          >
            <view 
              class="bar-fill"
              :style="{
                height: (day.distance / maxWeeklyDistance * 100) + '%'
              }"
            ></view>
            <text class="bar-label">{{ formatDate(day.date) }}</text>
          </view>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ weeklyTotalDistance }}km</text>
          <text class="stat-label">本周总里程</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ weeklyAvgDistance }}km</text>
          <text class="stat-label">日均里程</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ weeklyTotalSteps }}</text>
          <text class="stat-label">本周总步数</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn secondary" @click="importWeChatSports">
        <text class="btn-icon">📱</text>
        同步微信运动
      </button>
      <button class="action-btn primary" @click="showAddRecord = true">
        <text class="btn-icon">➕</text>
        手动添加运动记录
      </button>
    </view>

    <!-- 添加运动记录弹窗 -->
    <view v-if="showAddRecord" class="record-overlay" @click="showAddRecord = false">
      <view class="record-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">添加运动记录</text>
          <text class="popup-close" @click="showAddRecord = false">✕</text>
        </view>
        <view class="popup-content">
          <view class="form-item">
            <text class="form-label">运动类型</text>
            <picker :value="selectedSportType" @change="onSportTypeChange" :range="sportTypes" range-key="label">
              <view class="picker-item">{{ sportTypes[selectedSportType].label }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">距离 (公里)</text>
            <input type="number" v-model="recordDistance" placeholder="请输入距离" />
          </view>
          <view class="form-item">
            <text class="form-label">时长 (分钟)</text>
            <input type="number" v-model="recordDuration" placeholder="请输入时长" />
          </view>
        </view>
        <view class="popup-actions">
          <button class="popup-btn cancel" @click="showAddRecord = false">取消</button>
          <button class="popup-btn confirm" @click="addRecord">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore, useSportsStore, useChallengeStore } from '@/stores'

const userStore = useUserStore()
const sportsStore = useSportsStore()
const challengeStore = useChallengeStore()

// 响应式数据
const selectedPeriod = ref('month')
const showAddRecord = ref(false)
const selectedSportType = ref(0)
const recordDistance = ref('')
const recordDuration = ref('')

// 运动类型选项
const sportTypes = [
  { value: 'walk', label: '步行' },
  { value: 'run', label: '跑步' },
  { value: 'bike', label: '骑行' },
  { value: 'other', label: '其他' }
]

// 计算属性
const currentDate = computed(() => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
})

const todaySteps = computed(() => userStore.todaySteps)
const todayDistance = computed(() => userStore.todayDistance)
const todayCalories = computed(() => userStore.todayCalories)
const activeChallenges = computed(() => challengeStore.activeChallenges)
const weeklyData = computed(() => sportsStore.weeklyData)
const weeklyTotalDistance = computed(() => sportsStore.weeklyTotalDistance)
const weeklyAvgDistance = computed(() => sportsStore.weeklyAvgDistance)
const weeklyTotalSteps = computed(() => sportsStore.weeklyTotalSteps)

const maxWeeklyDistance = computed(() => {
  return Math.max(...weeklyData.value.map(day => day.distance))
})

// 方法
const navigateTo = (url: string) => {
  // 判断是否为tabBar页面
  const tabBarPages = [
    '/pages/index/index',
    '/pages/challenge-square/index',
    '/pages/my-sports/index',
    '/pages/profile/index'
  ]
  
  if (tabBarPages.includes(url)) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

const calculateDaysLeft = (challenge: any) => {
  const currentDate = new Date()
  const finishDate = new Date(challenge.estimatedFinishDate)
  const timeDiff = finishDate.getTime() - currentDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysDiff > 0 ? daysDiff : 0
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const importWeChatSports = () => {
  sportsStore.importWeChatSports()
}

const onSportTypeChange = (e: any) => {
  selectedSportType.value = e.detail.value
}

const addRecord = () => {
  if (!recordDistance.value || !recordDuration.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  const distance = parseFloat(recordDistance.value)
  const duration = parseInt(recordDuration.value)
  
  if (distance <= 0 || duration <= 0) {
    uni.showToast({
      title: '请输入有效的数值',
      icon: 'none'
    })
    return
  }

  sportsStore.addSportsRecord({
    date: currentDate.value,
    type: sportTypes[selectedSportType.value].value as any,
    distance: distance,
    duration: duration,
    calories: Math.round(distance * 60), // 简单的卡路里计算
    source: 'manual'
  })

  // 更新用户总里程
  userStore.addDistance(distance)

  // 更新挑战进度（如果有进行中的挑战）
  if (activeChallenges.value.length > 0) {
    challengeStore.updateChallengeProgress(activeChallenges.value[0].challengeId, distance)
  }

  uni.showToast({
    title: '添加成功',
    icon: 'success'
  })

  // 重置表单
  recordDistance.value = ''
  recordDuration.value = ''
  selectedSportType.value = 0
  showAddRecord.value = false
}

onMounted(() => {
  console.log('我的运动页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.today-card {
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
}

.date {
  font-size: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 8rpx 20rpx;
  border-radius: 50rpx;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.sports-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
  backdrop-filter: blur(10rpx);
}

.value {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.label {
  font-size: 24rpx;
  opacity: 0.8;
}

.challenges-section, .trend-section {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
}

.view-all {
  font-size: 24rpx;
  color: #165DFF;
}

.period-tabs {
  display: flex;
  gap: 20rpx;
}

.period-tab {
  font-size: 24rpx;
  color: #86909C;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  
  &.active {
    color: #165DFF;
    background: rgba(22, 93, 255, 0.1);
    border-bottom: 2rpx solid #165DFF;
  }
}

.challenge-progress-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.progress-item {
  background: #F2F3F5;
  border-radius: 16rpx;
  padding: 24rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.challenge-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
}

.progress-text {
  font-size: 24rpx;
  color: #86909C;
}

.progress-bar {
  height: 8rpx;
  background-color: #E5E6EB;
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #165DFF 0%, #4A90E2 100%);
  border-radius: 4rpx;
  transition: width 0.5s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
}

.stat {
  font-size: 24rpx;
  color: #86909C;
}

.chart-container {
  margin-bottom: 30rpx;
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 200rpx;
  gap: 20rpx;
  padding: 20rpx 0;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-fill {
  width: 30rpx;
  background: linear-gradient(to top, #165DFF 0%, #4A90E2 100%);
  border-radius: 4rpx 4rpx 0 0;
  min-height: 20rpx;
  transition: height 0.5s ease;
  margin-bottom: 16rpx;
}

.bar-label {
  font-size: 20rpx;
  color: #86909C;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-item {
  text-align: center;
  background: #F2F3F5;
  border-radius: 16rpx;
  padding: 24rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #165DFF;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #86909C;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  transition: all 0.3s ease;
  
  .btn-icon {
    font-size: 32rpx;
  }
  
  &.primary {
    background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
    color: white;
    box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
    
    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.3);
    }
  }
  
  &.secondary {
    background: white;
    color: #86909C;
    border: 2rpx solid #E5E6EB;
    
    &:active {
      background: #F2F3F5;
    }
  }
}

// 弹窗样式
.record-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.record-popup {
  background: white;
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #E5E6EB;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
}

.popup-close {
  font-size: 40rpx;
  color: #86909C;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #1D2129;
  display: block;
  margin-bottom: 16rpx;
}

.picker-item {
  background: #F2F3F5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #1D2129;
}

input {
  width: 100%;
  background: #F2F3F5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #1D2129;
  border: none;
  
  &::placeholder {
    color: #86909C;
  }
}

.popup-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #E5E6EB;
}

.popup-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  
  &.cancel {
    background: #F2F3F5;
    color: #86909C;
  }
  
  &.confirm {
    background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
    color: white;
  }
}
</style> 