<template>
  <view class="page">
    <!-- 排行榜类型切换 -->
    <view class="ranking-tabs">
      <view 
        v-for="(tab, index) in rankingTabs" 
        :key="index"
        class="tab-item"
        :class="{ active: selectedTab === index }"
        @click="selectedTab = index"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 我的排名卡片 -->
    <view class="my-ranking-card">
      <view class="ranking-header">
        <text class="section-title">我的排名</text>
        <text class="period-text">{{ rankingTabs[selectedTab].period }}</text>
      </view>
      <view class="my-rank-info">
        <view class="rank-avatar">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar"></image>
          <view class="rank-badge">{{ myRanking.rank }}</view>
        </view>
        <view class="rank-details">
          <text class="username">{{ userInfo.nickname }}</text>
          <text class="distance">{{ myRanking.distance }}公里</text>
          <text class="rank-desc">超越了{{ myRanking.beatPercentage }}%的好友</text>
        </view>
        <view class="energy-count">
          <text class="energy-icon">⚡</text>
          <text class="energy-num">{{ userInfo.energy || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 好友排行榜 -->
    <view class="friends-ranking">
      <view class="ranking-header">
        <text class="section-title">好友排行榜</text>
        <text class="invite-btn" @click="inviteFriends">邀请好友</text>
      </view>
      <view class="ranking-list">
        <view 
          v-for="(friend, index) in friendsRanking" 
          :key="friend.id"
          class="ranking-item"
          :class="{ 'top-three': index < 3 }"
        >
          <!-- 排名图标 -->
          <view class="rank-icon">
            <view v-if="index < 3" class="medal" :class="`medal-${index + 1}`">
              <text class="medal-text">{{ index + 1 }}</text>
            </view>
            <text v-else class="rank-number">{{ index + 1 }}</text>
          </view>

          <!-- 用户信息 -->
          <view class="friend-info">
            <image :src="friend.avatar" mode="aspectFill" class="friend-avatar"></image>
            <view class="friend-details">
              <view class="friend-header">
                <text class="friend-name">{{ friend.nickname }}</text>
                <view v-if="friend.currentChallenge" class="challenge-badge">
                  <text class="challenge-text">{{ friend.currentChallenge }}</text>
                </view>
              </view>
              <text class="friend-distance">{{ friend.weeklyDistance }}公里</text>
              <text class="last-active">{{ formatLastActive(friend.lastActiveTime) }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="friend-actions">
            <view class="energy-btn" @click="sendEnergy(friend.id)">
              <text class="energy-icon">⚡</text>
            </view>
            <view class="chat-btn" @click="chatWithFriend(friend.id)">
              <text class="chat-icon">💬</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加好友按钮 -->
    <view class="add-friend-section">
      <button class="add-friend-btn" @click="addFriend">
        <text class="btn-icon">👥</text>
        添加好友一起运动
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore, useSocialStore } from '@/stores'

const userStore = useUserStore()
const socialStore = useSocialStore()

// 响应式数据
const selectedTab = ref(0)

// 排行榜类型
const rankingTabs = [
  { label: '本周', period: '本周排名', key: 'week' },
  { label: '本月', period: '本月排名', key: 'month' },
  { label: '总排名', period: '总里程排名', key: 'total' }
]

// 计算属性
const userInfo = computed(() => userStore.userInfo)
const friendsRanking = computed(() => socialStore.friendsRanking)
const myRanking = computed(() => socialStore.myRanking)

// 方法
const formatLastActive = (time: string) => {
  const now = new Date()
  const activeTime = new Date(time)
  const diff = now.getTime() - activeTime.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天前活跃`
  } else if (hours > 0) {
    return `${hours}小时前活跃`
  } else if (minutes > 0) {
    return `${minutes}分钟前活跃`
  } else {
    return '刚刚活跃'
  }
}

const sendEnergy = (friendId: string) => {
  socialStore.sendEnergyToFriend(friendId)
  uni.showToast({
    title: '能量已发送',
    icon: 'success'
  })
}

const chatWithFriend = (friendId: string) => {
  uni.showToast({
    title: '聊天功能开发中',
    icon: 'none'
  })
}

const inviteFriends = () => {
  uni.showToast({
    title: '邀请功能开发中',
    icon: 'none'
  })
}

const addFriend = () => {
  uni.showToast({
    title: '添加好友功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  console.log('好友排名页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding: 20rpx;
}

.ranking-tabs {
  display: flex;
  background: white;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: #165DFF;
    
    .tab-text {
      color: white;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 28rpx;
  color: #86909C;
}

.my-ranking-card, .friends-ranking {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.ranking-header {
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

.period-text {
  font-size: 24rpx;
  color: #86909C;
}

.invite-btn {
  font-size: 24rpx;
  color: #165DFF;
  padding: 8rpx 16rpx;
  background: rgba(22, 93, 255, 0.1);
  border-radius: 20rpx;
}

.my-rank-info {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  color: white;
}

.rank-avatar {
  position: relative;
  margin-right: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.5);
}

.rank-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #FF4757;
  color: white;
  font-size: 20rpx;
  font-weight: bold;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-details {
  flex: 1;
}

.username {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.distance {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 4rpx;
}

.rank-desc {
  font-size: 24rpx;
  opacity: 0.8;
}

.energy-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 16rpx;
}

.energy-icon {
  font-size: 32rpx;
  margin-bottom: 4rpx;
}

.energy-num {
  font-size: 24rpx;
  font-weight: 600;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F2F3F5;
  border-radius: 16rpx;
  transition: all 0.3s ease;
  
  &.top-three {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
    border: 1rpx solid rgba(255, 193, 7, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.rank-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.medal {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.medal-1 {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  }
  
  &.medal-2 {
    background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
  }
  
  &.medal-3 {
    background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  }
}

.medal-text {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.rank-number {
  font-size: 32rpx;
  font-weight: 600;
  color: #86909C;
}

.friend-info {
  display: flex;
  flex: 1;
  align-items: center;
}

.friend-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.friend-details {
  flex: 1;
}

.friend-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.friend-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  margin-right: 12rpx;
}

.challenge-badge {
  background: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.challenge-text {
  font-size: 20rpx;
}

.friend-distance {
  font-size: 32rpx;
  font-weight: bold;
  color: #165DFF;
  display: block;
  margin-bottom: 4rpx;
}

.last-active {
  font-size: 24rpx;
  color: #86909C;
}

.friend-actions {
  display: flex;
  gap: 12rpx;
}

.energy-btn, .chat-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.energy-btn {
  background: rgba(255, 193, 7, 0.1);
  
  .energy-icon {
    font-size: 24rpx;
    color: #FFC107;
  }
}

.chat-btn {
  background: rgba(22, 93, 255, 0.1);
  
  .chat-icon {
    font-size: 24rpx;
    color: #165DFF;
  }
}

.add-friend-section {
  padding: 30rpx 0;
}

.add-friend-btn {
  width: 100%;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.3);
  }
}

.btn-icon {
  font-size: 32rpx;
}
</style> 