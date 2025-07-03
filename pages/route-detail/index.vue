<template>
  <view class="page">
    <!-- 路线封面图 -->
    <view class="route-hero">
      <image :src="routeDetail.image" mode="aspectFill" class="hero-image"></image>
      <view class="hero-overlay">
        <view class="hero-actions">
          <view class="action-btn" @click="goBack">
            <text class="icon">←</text>
          </view>
          <view class="action-btn" @click="shareRoute">
            <text class="icon">↗</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 路线基本信息 -->
    <view class="route-info">
      <view class="route-header">
        <text class="route-name">{{ routeDetail.name }}</text>
        <view class="route-theme">{{ routeDetail.theme }}</view>
      </view>
      
      <view class="route-stats">
        <view class="stat-item">
          <text class="icon">📍</text>
          <text class="text">{{ routeDetail.totalDistance }}公里</text>
        </view>
        <view class="stat-item">
          <text class="icon">⏰</text>
          <text class="text">预计{{ routeDetail.estimatedDays }}天完成</text>
        </view>
        <view class="stat-item">
          <text class="icon">📊</text>
          <text class="text">难度: {{ getDifficultyText(routeDetail.difficulty) }}</text>
        </view>
      </view>

      <text class="route-description">{{ routeDetail.description }}</text>

      <!-- 参与数据 -->
      <view class="participation-data">
        <view class="data-item">
          <text class="value">{{ routeDetail.participants }}</text>
          <text class="label">人正在挑战</text>
        </view>
        <view class="data-item">
          <text class="value">{{ routeDetail.rating }}</text>
          <text class="label">评分</text>
        </view>
        <view class="data-item">
          <text class="value">{{ routeDetail.reviews }}</text>
          <text class="label">评价</text>
        </view>
      </view>
    </view>

    <!-- 路线预览地图 -->
    <view class="route-map">
      <text class="section-title">路线预览</text>
      <view class="map-container">
        <image :src="'/static/maps/default-map.jpg'" mode="aspectFill" class="map-image"></image>
        <view class="map-progress" v-if="userProgress > 0">
          <view class="progress-marker" :style="{left: userProgress + '%'}">
            <view class="marker-dot"></view>
            <view class="marker-info">
              <text class="marker-text">{{ userProgress }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 挑战奖励 -->
    <view class="rewards-section">
      <text class="section-title">挑战奖励</text>
      <view class="rewards-grid">
        <view 
          v-for="(reward, index) in routeDetail.rewards" 
          :key="index"
          class="reward-item"
        >
          <view class="reward-icon">
            <text class="icon">{{ getRewardIcon(reward) }}</text>
          </view>
          <text class="reward-text">{{ reward }}</text>
        </view>
      </view>
    </view>

    <!-- 用户进度（如果已参与） -->
    <view v-if="userChallenge" class="user-progress">
      <text class="section-title">我的进度</text>
      <view class="progress-card">
        <view class="progress-header">
          <text class="progress-title">当前进度</text>
          <text class="progress-percentage">{{ userChallenge.progress }}%</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{width: userChallenge.progress + '%'}"></view>
        </view>
        <view class="progress-details">
          <text class="detail">已完成 {{ userChallenge.currentDistance }}/{{ routeDetail.totalDistance }} 公里</text>
          <text class="detail">预计还需{{ calculateDaysLeft() }}天</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button 
        v-if="!userChallenge" 
        class="join-btn" 
        @click="showPackageSelector = true"
      >
        立即报名挑战
      </button>
      <button 
        v-else 
        class="continue-btn" 
        @click="navigateTo('/pages/my-sports/index')"
      >
        继续挑战
      </button>
    </view>

    <!-- 套餐选择弹窗 -->
    <view v-if="showPackageSelector" class="package-overlay" @click="showPackageSelector = false">
      <view class="package-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">选择挑战套餐</text>
          <text class="popup-close" @click="showPackageSelector = false">✕</text>
        </view>
        <view class="package-list">
          <view 
            v-for="(pkg, index) in packages" 
            :key="index"
            class="package-item"
            :class="{ active: selectedPackage === index }"
            @click="selectedPackage = index"
          >
            <view class="package-info">
              <text class="package-name">{{ pkg.name }}</text>
              <text class="package-desc">{{ pkg.description }}</text>
            </view>
            <view class="package-price">
              <text class="price">{{ pkg.price === 0 ? '免费' : '¥' + pkg.price }}</text>
            </view>
          </view>
        </view>
        <view class="popup-actions">
          <button class="cancel-btn" @click="showPackageSelector = false">取消</button>
          <button class="confirm-btn" @click="joinChallenge">确认报名</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useChallengeStore } from '@/stores'

const challengeStore = useChallengeStore()

// 响应式数据
const routeId = ref('')
const showPackageSelector = ref(false)
const selectedPackage = ref(0)

// 套餐选项
const packages = [
  {
    name: '基础版',
    description: '虚拟成就 + 电子证书',
    price: 0
  },
  {
    name: '进阶版',
    description: '虚拟成就 + 电子证书 + 实体奖牌',
    price: 39.9
  },
  {
    name: '豪华版',
    description: '虚拟成就 + 电子证书 + 实体奖牌 + 限定周边',
    price: 89.9
  }
]

// 计算属性
const routeDetail = computed(() => {
  return challengeStore.getChallengeById(routeId.value) || {
    id: '',
    name: '加载中...',
    description: '',
    totalDistance: 0,
    difficulty: 'medium' as const,
    theme: '',
    participants: 0,
    rating: 0,
    reviews: 0,
    image: '/static/logo.png',
    estimatedDays: 0,
    rewards: []
  }
})

const userChallenge = computed(() => {
  return challengeStore.activeChallenges.find(c => c.challengeId === routeId.value)
})

const userProgress = computed(() => {
  return userChallenge.value?.progress || 0
})

// 方法
const getDifficultyText = (difficulty: string) => {
  const difficultyMap = {
    'easy': '简单',
    'medium': '中等', 
    'hard': '困难'
  }
  return difficultyMap[difficulty] || '未知'
}

const getRewardIcon = (reward: string) => {
  const iconMap = {
    '电子版证书': '📜',
    '实体奖牌': '🏅',
    '限定周边': '🎁',
    '文创周边': '🎨'
  }
  return iconMap[reward] || '🎯'
}

const calculateDaysLeft = () => {
  if (!userChallenge.value) return 0
  const currentDate = new Date()
  const finishDate = new Date(userChallenge.value.estimatedFinishDate)
  const timeDiff = finishDate.getTime() - currentDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysDiff > 0 ? daysDiff : 0
}

const goBack = () => {
  uni.navigateBack()
}

const shareRoute = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

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

const joinChallenge = () => {
  const success = challengeStore.joinChallenge(routeId.value)
  if (success) {
    uni.showToast({
      title: '报名成功！',
      icon: 'success'
    })
    showPackageSelector.value = false
    
    // 延迟跳转到运动页面
    setTimeout(() => {
      navigateTo('/pages/my-sports/index')
    }, 1500)
  } else {
    uni.showToast({
      title: '报名失败，请重试',
      icon: 'none'
    })
  }
}

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    routeId.value = options.id
  }
})

onMounted(() => {
  console.log('路线详情页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
}

.route-hero {
  position: relative;
  height: 400rpx;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.5) 100%);
}

.hero-actions {
  position: absolute;
  top: 60rpx;
  left: 30rpx;
  right: 30rpx;
  display: flex;
  justify-content: space-between;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.route-info {
  background: white;
  padding: 30rpx;
  margin: -40rpx 20rpx 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.route-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #1D2129;
  flex: 1;
}

.route-theme {
  background: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  margin-left: 20rpx;
}

.route-stats {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .icon {
    font-size: 24rpx;
  }
  
  .text {
    font-size: 24rpx;
    color: #86909C;
  }
}

.route-description {
  font-size: 28rpx;
  color: #4E5969;
  line-height: 1.6;
  margin-bottom: 30rpx;
}

.participation-data {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 20rpx 0;
  border-top: 1rpx solid #E5E6EB;
}

.data-item {
  text-align: center;
  
  .value {
    font-size: 32rpx;
    font-weight: bold;
    color: #165DFF;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .label {
    font-size: 24rpx;
    color: #86909C;
  }
}

.route-map, .rewards-section, .user-progress {
  background: white;
  margin: 0 20rpx 20rpx;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 30rpx;
}

.map-container {
  position: relative;
  height: 240rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.map-image {
  width: 100%;
  height: 100%;
}

.map-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.progress-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.marker-dot {
  width: 20rpx;
  height: 20rpx;
  background: #165DFF;
  border-radius: 50%;
  border: 4rpx solid white;
  box-shadow: 0 4rpx 12rpx rgba(22, 93, 255, 0.4);
}

.marker-info {
  position: absolute;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12rpx;
  padding: 8rpx 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.marker-text {
  font-size: 20rpx;
  color: #165DFF;
  font-weight: 600;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F2F3F5;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
}

.reward-icon {
  width: 120rpx;
  height: 120rpx;
  background: rgba(22, 93, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  
  .icon {
    font-size: 48rpx;
  }
}

.reward-text {
  font-size: 24rpx;
  color: #1D2129;
  text-align: center;
}

.progress-card {
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

.progress-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
}

.progress-percentage {
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

.progress-details {
  display: flex;
  justify-content: space-between;
}

.detail {
  font-size: 24rpx;
  color: #86909C;
}

.action-section {
  padding: 30rpx 20rpx 60rpx;
}

.join-btn, .continue-btn {
  width: 100%;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.3);
  }
}

.continue-btn {
  background: white;
  color: #165DFF;
  border: 2rpx solid #165DFF;
  box-shadow: none;
  
  &:active {
    background: rgba(22, 93, 255, 0.05);
  }
}

// 弹窗样式
.package-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.package-popup {
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
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

.package-list {
  padding: 30rpx;
}

.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid #E5E6EB;
  margin-bottom: 16rpx;
  transition: all 0.3s ease;
  
  &.active {
    border-color: #165DFF;
    background: rgba(22, 93, 255, 0.05);
  }
}

.package-info {
  flex: 1;
}

.package-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.package-desc {
  font-size: 24rpx;
  color: #86909C;
}

.package-price {
  .price {
    font-size: 32rpx;
    font-weight: bold;
    color: #165DFF;
  }
}

.popup-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #E5E6EB;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.cancel-btn {
  background: #F2F3F5;
  color: #86909C;
}

.confirm-btn {
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
}
</style> 