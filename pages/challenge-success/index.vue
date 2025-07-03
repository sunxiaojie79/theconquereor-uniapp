<template>
  <view class="page">
    <!-- 成功动画背景 -->
    <view class="success-bg">
      <view class="confetti-container">
        <view v-for="i in 20" :key="i" class="confetti" :class="`confetti-${i % 6}`"></view>
      </view>
      
      <!-- 成功图标 -->
      <view class="success-icon-wrapper">
        <view class="success-icon">🎉</view>
        <view class="success-ring"></view>
        <view class="success-ring success-ring-2"></view>
      </view>
      
      <!-- 成功文字 -->
      <view class="success-text">
        <text class="success-title">挑战完成！</text>
        <text class="success-subtitle">恭喜你成功完成了这次挑战</text>
      </view>
    </view>
    
    <!-- 挑战信息卡片 -->
    <view class="challenge-info-card">
      <view class="challenge-header">
        <image :src="challengeData.image" mode="aspectFill" class="challenge-image"></image>
        <view class="challenge-details">
          <text class="challenge-name">{{ challengeData.name }}</text>
          <text class="challenge-distance">{{ challengeData.totalDistance }}公里</text>
          <text class="completion-time">用时{{ challengeData.completionDays }}天</text>
        </view>
      </view>
      
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ challengeData.totalSteps }}</text>
          <text class="stat-label">总步数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ challengeData.totalTime }}</text>
          <text class="stat-label">运动时长</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ challengeData.avgPace }}</text>
          <text class="stat-label">平均配速</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ challengeData.calories }}</text>
          <text class="stat-label">消耗卡路里</text>
        </view>
      </view>
    </view>
    
    <!-- 获得奖励 -->
    <view class="rewards-section">
      <view class="section-header">
        <text class="section-title">🏆 获得奖励</text>
      </view>
      
      <view class="rewards-grid">
        <view 
          v-for="reward in challengeData.rewards" 
          :key="reward.id"
          class="reward-card"
        >
          <view class="reward-image-wrapper">
            <image :src="reward.image" mode="aspectFill" class="reward-image"></image>
            <view class="reward-shine"></view>
          </view>
          <text class="reward-name">{{ reward.name }}</text>
          <text class="reward-desc">{{ reward.description }}</text>
        </view>
      </view>
    </view>
    
    <!-- 成就解锁 -->
    <view class="achievements-section" v-if="challengeData.achievements.length > 0">
      <view class="section-header">
        <text class="section-title">🎖️ 解锁成就</text>
      </view>
      
      <view class="achievements-list">
        <view 
          v-for="achievement in challengeData.achievements" 
          :key="achievement.id"
          class="achievement-item"
        >
          <view class="achievement-icon">{{ achievement.icon }}</view>
          <view class="achievement-info">
            <text class="achievement-name">{{ achievement.name }}</text>
            <text class="achievement-desc">{{ achievement.description }}</text>
          </view>
          <view class="achievement-badge">新</view>
        </view>
      </view>
    </view>
    
    <!-- 分享激励 -->
    <view class="share-section">
      <view class="share-card">
        <view class="share-header">
          <text class="share-title">分享你的成就</text>
          <text class="share-subtitle">让朋友们看看你的精彩表现</text>
        </view>
        
        <view class="share-preview">
          <view class="share-content">
            <text class="share-text">我刚刚完成了{{ challengeData.name }}挑战！</text>
            <text class="share-stats">{{ challengeData.totalDistance }}公里 · {{ challengeData.completionDays }}天</text>
          </view>
          <view class="share-medal">🏅</view>
        </view>
        
        <view class="share-buttons">
          <button class="share-btn wechat" @click="shareToWechat">
            <text class="share-btn-text">分享到微信</text>
          </button>
          <button class="share-btn moments" @click="shareToMoments">
            <text class="share-btn-text">朋友圈</text>
          </button>
        </view>
      </view>
    </view>
    
    <!-- 下一个挑战推荐 -->
    <view class="next-challenge-section">
      <view class="section-header">
        <text class="section-title">🚀 推荐下一个挑战</text>
      </view>
      
      <view class="next-challenge-card" @click="viewNextChallenge">
        <image :src="nextChallenge.image" mode="aspectFill" class="next-challenge-image"></image>
        <view class="next-challenge-info">
          <text class="next-challenge-name">{{ nextChallenge.name }}</text>
          <text class="next-challenge-desc">{{ nextChallenge.description }}</text>
          <view class="next-challenge-stats">
            <text class="next-challenge-distance">{{ nextChallenge.distance }}公里</text>
            <text class="next-challenge-difficulty">{{ nextChallenge.difficulty }}</text>
          </view>
        </view>
        <view class="next-challenge-arrow">→</view>
      </view>
    </view>
    
    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @click="goHome">
        <text class="action-btn-text">返回首页</text>
      </button>
      <button class="action-btn primary" @click="startNewChallenge">
        <text class="action-btn-text">开始新挑战</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 挑战数据（通常从路由参数或API获取）
const challengeData = ref({
  id: '1',
  name: '万里长城挑战',
  image: '/static/challenges/great-wall.jpg',
  totalDistance: 21196,
  completionDays: 365,
  totalSteps: 30000000,
  totalTime: '2,880小时',
  avgPace: '8:30',
  calories: 1500000,
  rewards: [
    {
      id: '1',
      name: '长城勇士勋章',
      description: '完成万里长城挑战专属勋章',
      image: '/static/medals/great-wall.png'
    },
    {
      id: '2',
      name: '1000积分',
      description: '挑战完成奖励积分',
      image: '/static/logo.png'
    },
    {
      id: '3',
      name: '专属头像框',
      description: '长城主题头像装饰',
      image: '/static/logo.png'
    }
  ],
  achievements: [
    {
      id: '1',
      name: '坚持不懈',
      description: '连续365天完成运动目标',
      icon: '💪'
    },
    {
      id: '2',
      name: '里程碑',
      description: '累计完成超过20000公里',
      icon: '🎯'
    }
  ]
})

// 下一个推荐挑战
const nextChallenge = ref({
  id: '2',
  name: '丝绸之路探险',
  description: '穿越古老的丝绸之路，体验历史文化',
  image: '/static/challenges/silk-road.jpg',
  distance: 12000,
  difficulty: '高级'
})

// 方法
const shareToWechat = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

const shareToMoments = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

const viewNextChallenge = () => {
  uni.navigateTo({
    url: `/pages/route-detail/index?id=${nextChallenge.value.id}`
  })
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

const startNewChallenge = () => {
  uni.switchTab({
    url: '/pages/challenge-square/index'
  })
}

onMounted(() => {
  console.log('挑战成功页面加载完成')
  
  // 播放成功动画
  setTimeout(() => {
    console.log('成功动画播放完成')
  }, 2000)
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 30%, #F1F5F9 100%);
  min-height: 100vh;
  padding: 0 20rpx 40rpx;
  overflow-x: hidden;
}

.success-bg {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
  margin-bottom: 40rpx;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  animation: confetti-fall 3s infinite;
  
  &.confetti-0 { background: #FF6B6B; left: 10%; animation-delay: 0s; }
  &.confetti-1 { background: #4ECDC4; left: 20%; animation-delay: 0.2s; }
  &.confetti-2 { background: #45B7D1; left: 30%; animation-delay: 0.4s; }
  &.confetti-3 { background: #FFA726; left: 40%; animation-delay: 0.6s; }
  &.confetti-4 { background: #66BB6A; left: 50%; animation-delay: 0.8s; }
  &.confetti-5 { background: #AB47BC; left: 60%; animation-delay: 1s; }
}

@keyframes confetti-fall {
  0% { transform: translateY(-100rpx) rotate(0deg); opacity: 1; }
  100% { transform: translateY(800rpx) rotate(360deg); opacity: 0; }
}

.success-icon-wrapper {
  position: relative;
  margin-bottom: 40rpx;
}

.success-icon {
  font-size: 120rpx;
  position: relative;
  z-index: 2;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-20rpx); }
  70% { transform: translateY(-10rpx); }
  90% { transform: translateY(-4rpx); }
}

.success-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 200rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ring-expand 2s infinite;
  
  &.success-ring-2 {
    width: 160rpx;
    height: 160rpx;
    animation-delay: 0.5s;
  }
}

@keyframes ring-expand {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}

.success-text {
  text-align: center;
  color: white;
}

.success-title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.success-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.challenge-info-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
}

.challenge-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.challenge-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.challenge-details {
  flex: 1;
}

.challenge-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.challenge-distance {
  font-size: 28rpx;
  color: #4E5969;
  display: block;
  margin-bottom: 4rpx;
}

.completion-time {
  font-size: 24rpx;
  color: #86909C;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.stat-item {
  text-align: center;
  padding: 20rpx;
  background: #F7F8FA;
  border-radius: 16rpx;
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

.section-header {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1D2129;
}

.rewards-section {
  margin-bottom: 40rpx;
}

.rewards-grid {
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
  padding-bottom: 10rpx;
}

.reward-card {
  flex-shrink: 0;
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  text-align: center;
  width: 200rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.reward-image-wrapper {
  position: relative;
  margin-bottom: 16rpx;
}

.reward-image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
}

.reward-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  border-radius: 12rpx;
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.reward-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.reward-desc {
  font-size: 22rpx;
  color: #86909C;
  line-height: 1.4;
}

.achievements-section {
  margin-bottom: 40rpx;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.achievement-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.achievement-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 6rpx;
}

.achievement-desc {
  font-size: 24rpx;
  color: #86909C;
}

.achievement-badge {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  font-size: 20rpx;
  font-weight: bold;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
}

.share-section {
  margin-bottom: 40rpx;
}

.share-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

.share-header {
  text-align: center;
  margin-bottom: 24rpx;
}

.share-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.share-subtitle {
  font-size: 26rpx;
  color: #86909C;
}

.share-preview {
  display: flex;
  align-items: center;
  background: #F7F8FA;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}

.share-content {
  flex: 1;
}

.share-text {
  font-size: 28rpx;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.share-stats {
  font-size: 24rpx;
  color: #86909C;
}

.share-medal {
  font-size: 60rpx;
}

.share-buttons {
  display: flex;
  gap: 16rpx;
}

.share-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  
  &.wechat {
    background: #07C160;
    color: white;
  }
  
  &.moments {
    background: #1890FF;
    color: white;
  }
}

.next-challenge-section {
  margin-bottom: 40rpx;
}

.next-challenge-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.next-challenge-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.next-challenge-info {
  flex: 1;
}

.next-challenge-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.next-challenge-desc {
  font-size: 24rpx;
  color: #86909C;
  display: block;
  margin-bottom: 8rpx;
}

.next-challenge-stats {
  display: flex;
  gap: 16rpx;
}

.next-challenge-distance, .next-challenge-difficulty {
  font-size: 22rpx;
  color: #165DFF;
  background: rgba(22, 93, 255, 0.1);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.next-challenge-arrow {
  font-size: 32rpx;
  color: #165DFF;
  font-weight: bold;
}

.bottom-actions {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;
  position: sticky;
  bottom: 20rpx;
}

.action-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.secondary {
    background: white;
    color: #4E5969;
    border: 2rpx solid #E5E6EB;
  }
  
  &.primary {
    background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
    color: white;
  }
  
  &:active {
    transform: translateY(2rpx);
  }
}

.action-btn-text {
  color: inherit;
}
</style> 