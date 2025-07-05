<template>
  <view class="page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <image class="bg-image" src="/static/bg/profile-bg.jpg" mode="aspectFill"></image>
      <view class="user-info">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar"></image>
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="level">{{ userLevel }}</text>
        <view class="total-distance">
          <text class="distance-icon">📍</text>
          <text class="distance-text">总里程: {{ userInfo.totalDistance }}公里</text>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.completedChallenges }}</text>
        <text class="stat-label">已完成挑战</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.medals }}</text>
        <text class="stat-label">已获得勋章</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.points }}</text>
        <text class="stat-label">运动积分</text>
      </view>
    </view>

    <!-- 成就勋章 -->
    <view class="medals-section">
      <view class="section-header">
        <text class="section-title">成就勋章</text>
        <text class="view-all" @click="navigateTo('/pages/reward-store/index')">查看全部</text>
      </view>
      <view class="medals-grid">
        <view 
          v-for="(medal, index) in medals" 
          :key="index"
          class="medal-item"
          :class="{ unlocked: medal.unlocked }"
        >
          <image :src="medal.image" mode="aspectFill" class="medal-image"></image>
          <text class="medal-name">{{ medal.name }}</text>
        </view>
      </view>
    </view>

    <!-- 我的实体奖励 -->
    <view class="rewards-section">
      <text class="section-title">我的实体奖励</text>
      <view class="rewards-grid">
        <view 
          v-for="(reward, index) in physicalRewards" 
          :key="index"
          class="reward-item"
        >
          <image :src="reward.image" mode="aspectFill" class="reward-image"></image>
          <text class="reward-name">{{ reward.name }}</text>
        </view>
      </view>
    </view>

    <!-- 设置选项 -->
    <view class="settings-section">
      <view class="settings-grid">
        <view class="setting-item" @click="navigateTo('/pages/social-ranking/index')">
          <view class="setting-icon">👥</view>
          <text class="setting-text">好友排名</text>
        </view>
        <view class="setting-item" @click="navigateTo('/pages/team-challenge/index')">
          <view class="setting-icon">🏆</view>
          <text class="setting-text">我的队伍</text>
        </view>
        <view class="setting-item" @click="showSettings">
          <view class="setting-icon">⚙️</view>
          <text class="setting-text">设置</text>
        </view>
        <view class="setting-item" @click="showHelp">
          <view class="setting-icon">❓</view>
          <text class="setting-text">帮助与反馈</text>
        </view>
      </view>
    </view>

    <!-- 进行中挑战预览 -->
    <view class="active-challenges-preview" v-if="activeChallenges.length > 0">
      <text class="section-title">进行中挑战</text>
      <view 
        v-for="challenge in activeChallenges.slice(0, 2)" 
        :key="challenge.challengeId"
        class="challenge-preview-item"
        @click="navigateTo(`/pages/route-detail/index?id=${challenge.challengeId}`)"
      >
        <image :src="challenge.challenge.image" mode="aspectFill" class="challenge-image"></image>
        <view class="challenge-info">
          <text class="challenge-name">{{ challenge.challenge.name }}</text>
          <view class="progress-container">
            <view class="progress-bar">
              <view class="progress-fill" :style="{width: challenge.progress + '%'}"></view>
            </view>
            <text class="progress-text">{{ challenge.progress }}%</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore, useChallengeStore } from '@/stores'

const userStore = useUserStore()
const challengeStore = useChallengeStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)
const userLevel = computed(() => userStore.userLevel)
const activeChallenges = computed(() => challengeStore.activeChallenges)

// 成就勋章数据
const medals = [
  {
    name: '丝绸之路',
    image: '/static/medals/silk-road.png',
    unlocked: true
  },
  {
    name: '长城',
    image: '/static/medals/great-wall.png',
    unlocked: true
  },
  {
    name: '撒哈拉',
    image: '/static/medals/sahara.png',
    unlocked: true
  },
  {
    name: '未解锁',
    image: '/static/medals/locked.png',
    unlocked: false
  },
  {
    name: '未解锁',
    image: '/static/medals/locked.png',
    unlocked: false
  }
]

// 实体奖励数据
const physicalRewards = [
  {
    name: '丝绸之路奖牌',
    image: '/static/rewards/silk-road-medal.png'
  },
  {
    name: '长城纪念章',
    image: '/static/rewards/great-wall-badge.png'
  },
  {
    name: '敦煌文创',
    image: '/static/rewards/dunhuang-cultural.png'
  }
]

// 方法
const navigateTo = (url: string) => {
  // 判断是否为tabBar页面
  const tabBarPages = [
    '/pages/index/index',
    '/pages/challenge-detail/index',
    '/pages/my-sports/index',
    '/pages/profile/index'
  ]
  
  if (tabBarPages.includes(url)) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

const showSettings = () => {
  uni.showToast({
    title: '设置功能开发中',
    icon: 'none'
  })
}

const showHelp = () => {
  uni.showToast({
    title: '帮助功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  console.log('个人中心页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.user-card {
  position: relative;
  height: 320rpx;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.user-info {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.5);
  margin-bottom: 16rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.level {
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 20rpx;
}

.total-distance {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border-radius: 50rpx;
  padding: 12rpx 24rpx;
}

.distance-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.distance-text {
  font-size: 24rpx;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin: 20rpx;
  margin-bottom: 30rpx;
}

.stat-item {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #165DFF;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #86909C;
}

.medals-section, .rewards-section {
  background: white;
  margin: 0 20rpx 30rpx;
  border-radius: 24rpx;
  padding: 30rpx;
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
  display: block;
  margin-bottom: 30rpx;
}

.view-all {
  font-size: 24rpx;
  color: #165DFF;
}

.medals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx;
}

.medal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &.unlocked .medal-image {
    filter: none;
    transform: scale(1);
    transition: transform 0.3s ease;
    
    &:active {
      transform: scale(1.1);
    }
  }
  
  &:not(.unlocked) .medal-image {
    filter: grayscale(100%);
    opacity: 0.5;
  }
}

.medal-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-bottom: 8rpx;
}

.medal-name {
  font-size: 20rpx;
  color: #86909C;
  text-align: center;
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
  padding: 20rpx;
}

.reward-image {
  width: 100%;
  height: 120rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.reward-name {
  font-size: 24rpx;
  color: #1D2129;
  text-align: center;
}

.settings-section {
  margin: 0 20rpx 30rpx;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.setting-item {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #F2F3F5;
  }
}

.setting-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.setting-text {
  font-size: 24rpx;
  color: #1D2129;
}

.active-challenges-preview {
  background: white;
  margin: 0 20rpx 30rpx;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.challenge-preview-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.challenge-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.challenge-info {
  flex: 1;
}

.challenge-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 12rpx;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-bar {
  flex: 1;
  height: 6rpx;
  background-color: #E5E6EB;
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #165DFF 0%, #4A90E2 100%);
  border-radius: 3rpx;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 20rpx;
  color: #86909C;
  min-width: 60rpx;
}
</style> 