<template>
  <view class="page">
    <!-- 我的团队信息 -->
    <view v-if="currentTeam" class="team-card">
      <view class="team-header">
        <view class="team-info">
          <text class="team-name">{{ currentTeam.name }}</text>
          <text class="team-challenge">{{ currentTeam.challengeName }}</text>
        </view>
        <view class="team-rank">
          <text class="rank-label">团队排名</text>
          <text class="rank-number">#{{ currentTeam.rank }}</text>
        </view>
      </view>

      <!-- 团队进度 -->
      <view class="team-progress">
        <view class="progress-header">
          <text class="progress-title">团队总进度</text>
          <text class="progress-percentage">{{ teamProgressPercentage }}%</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{width: teamProgressPercentage + '%'}"></view>
        </view>
        <view class="progress-stats">
          <text class="stat">已完成 {{ currentTeam.totalDistance }}/{{ currentTeam.targetDistance }} 公里</text>
          <text class="stat">创建于 {{ formatDate(currentTeam.createdAt) }}</text>
        </view>
      </view>
    </view>

    <!-- 无团队状态 -->
    <view v-else class="no-team-card">
      <text class="no-team-icon">👥</text>
      <text class="no-team-title">还没有加入团队</text>
      <text class="no-team-desc">加入或创建团队，与好友一起挑战更有趣！</text>
      <view class="no-team-actions">
        <button class="action-btn secondary" @click="showJoinTeam = true">加入团队</button>
        <button class="action-btn primary" @click="showCreateTeam = true">创建团队</button>
      </view>
    </view>

    <!-- 团队成员 -->
    <view v-if="currentTeam" class="members-section">
      <view class="section-header">
        <text class="section-title">团队成员 ({{ currentTeam.members.length }})</text>
        <text class="invite-btn" @click="inviteMembers">邀请好友</text>
      </view>
      <view class="members-list">
        <view 
          v-for="member in currentTeam.members" 
          :key="member.id"
          class="member-item"
        >
          <view class="member-avatar">
            <image :src="member.avatar" mode="aspectFill" class="avatar"></image>
            <view v-if="member.isLeader" class="leader-badge">队长</view>
          </view>
          <view class="member-info">
            <text class="member-name">{{ member.nickname }}</text>
            <text class="member-distance">{{ member.distance }}公里</text>
            <view class="member-rank">
              <text class="rank-text">队内排名 #{{ member.rank }}</text>
            </view>
          </view>
          <view class="member-actions">
            <view class="cheer-btn" @click="cheerMember(member.id)">
              <text class="cheer-icon">👍</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 团队动态 -->
    <view v-if="currentTeam" class="activities-section">
      <text class="section-title">团队动态</text>
      <view class="activities-list">
        <view 
          v-for="activity in teamActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <image :src="activity.avatar" mode="aspectFill" class="activity-avatar"></image>
          <view class="activity-content">
            <view class="activity-header">
              <text class="activity-user">{{ activity.nickname }}</text>
              <text class="activity-time">{{ formatTime(activity.time) }}</text>
            </view>
            <text class="activity-text">{{ activity.content }}</text>
          </view>
          <view class="activity-type" :class="activity.type">
            <text class="type-icon">{{ getActivityIcon(activity.type) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 团队操作按钮 -->
    <view v-if="currentTeam" class="team-actions">
      <button class="action-btn secondary" @click="shareTeam">分享团队</button>
      <button class="action-btn danger" @click="leaveTeam">退出团队</button>
    </view>

    <!-- 创建团队弹窗 -->
    <view v-if="showCreateTeam" class="popup-overlay" @click="showCreateTeam = false">
      <view class="popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">创建团队</text>
          <text class="popup-close" @click="showCreateTeam = false">✕</text>
        </view>
        <view class="popup-content">
          <view class="form-item">
            <text class="form-label">团队名称</text>
            <input v-model="teamName" placeholder="请输入团队名称" maxlength="20" />
          </view>
          <view class="form-item">
            <text class="form-label">选择挑战</text>
            <picker :value="selectedChallengeIndex" @change="onChallengeChange" :range="availableChallenges" range-key="name">
              <view class="picker-item">{{ availableChallenges[selectedChallengeIndex].name }}</view>
            </picker>
          </view>
        </view>
        <view class="popup-actions">
          <button class="popup-btn cancel" @click="showCreateTeam = false">取消</button>
          <button class="popup-btn confirm" @click="createTeam">创建</button>
        </view>
      </view>
    </view>

    <!-- 加入团队弹窗 -->
    <view v-if="showJoinTeam" class="popup-overlay" @click="showJoinTeam = false">
      <view class="popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">加入团队</text>
          <text class="popup-close" @click="showJoinTeam = false">✕</text>
        </view>
        <view class="popup-content">
          <view class="form-item">
            <text class="form-label">团队邀请码</text>
            <input v-model="inviteCode" placeholder="请输入团队邀请码" />
          </view>
        </view>
        <view class="popup-actions">
          <button class="popup-btn cancel" @click="showJoinTeam = false">取消</button>
          <button class="popup-btn confirm" @click="joinTeam">加入</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSocialStore, useChallengeStore } from '@/stores'

const socialStore = useSocialStore()
const challengeStore = useChallengeStore()

// 响应式数据
const showCreateTeam = ref(false)
const showJoinTeam = ref(false)
const teamName = ref('')
const inviteCode = ref('')
const selectedChallengeIndex = ref(0)

// 计算属性
const currentTeam = computed(() => socialStore.currentTeam)
const teamActivities = computed(() => socialStore.teamActivities)
const availableChallenges = computed(() => challengeStore.challenges)

const teamProgressPercentage = computed(() => {
  if (!currentTeam.value) return 0
  return Math.round((currentTeam.value.totalDistance / currentTeam.value.targetDistance) * 100)
})

// 方法
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const formatTime = (timeStr: string) => {
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

const getActivityIcon = (type: string) => {
  const iconMap = {
    'exercise': '🏃',
    'achievement': '🏆',
    'message': '💬'
  }
  return iconMap[type] || '📝'
}

const cheerMember = (memberId: string) => {
  uni.showToast({
    title: '为队友加油！',
    icon: 'success'
  })
}

const inviteMembers = () => {
  uni.showToast({
    title: '邀请功能开发中',
    icon: 'none'
  })
}

const shareTeam = () => {
  socialStore.shareTeam()
}

const leaveTeam = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出当前团队吗？',
    success: (res) => {
      if (res.confirm) {
        socialStore.leaveTeam()
        uni.showToast({
          title: '已退出团队',
          icon: 'success'
        })
      }
    }
  })
}

const onChallengeChange = (e: any) => {
  selectedChallengeIndex.value = e.detail.value
}

const createTeam = () => {
  if (!teamName.value.trim()) {
    uni.showToast({
      title: '请输入团队名称',
      icon: 'none'
    })
    return
  }

  const challengeId = availableChallenges.value[selectedChallengeIndex.value].id
  const success = socialStore.createTeam(teamName.value, challengeId)
  
  if (success) {
    uni.showToast({
      title: '团队创建成功！',
      icon: 'success'
    })
    showCreateTeam.value = false
    teamName.value = ''
  } else {
    uni.showToast({
      title: '创建失败，请重试',
      icon: 'none'
    })
  }
}

const joinTeam = () => {
  if (!inviteCode.value.trim()) {
    uni.showToast({
      title: '请输入邀请码',
      icon: 'none'
    })
    return
  }

  const success = socialStore.joinTeam(inviteCode.value)
  
  if (success) {
    uni.showToast({
      title: '加入团队成功！',
      icon: 'success'
    })
    showJoinTeam.value = false
    inviteCode.value = ''
  } else {
    uni.showToast({
      title: '邀请码无效',
      icon: 'none'
    })
  }
}

onMounted(() => {
  console.log('组队挑战页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.team-card {
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  color: white;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 36rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.team-challenge {
  font-size: 24rpx;
  opacity: 0.8;
}

.team-rank {
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  padding: 16rpx;
  backdrop-filter: blur(10rpx);
}

.rank-label {
  font-size: 20rpx;
  display: block;
  margin-bottom: 4rpx;
}

.rank-number {
  font-size: 32rpx;
  font-weight: bold;
}

.team-progress {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 24rpx;
  backdrop-filter: blur(10rpx);
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
}

.progress-percentage {
  font-size: 24rpx;
}

.progress-bar {
  height: 8rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4rpx;
  transition: width 0.5s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
}

.stat {
  font-size: 24rpx;
  opacity: 0.8;
}

.no-team-card {
  background: white;
  border-radius: 24rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.no-team-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 30rpx;
}

.no-team-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 16rpx;
}

.no-team-desc {
  font-size: 28rpx;
  color: #86909C;
  line-height: 1.5;
  display: block;
  margin-bottom: 40rpx;
}

.no-team-actions {
  display: flex;
  gap: 20rpx;
}

.members-section, .activities-section {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
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

.invite-btn {
  font-size: 24rpx;
  color: #165DFF;
  padding: 8rpx 16rpx;
  background: rgba(22, 93, 255, 0.1);
  border-radius: 20rpx;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F2F3F5;
  border-radius: 16rpx;
}

.member-avatar {
  position: relative;
  margin-right: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.leader-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #FF4757;
  color: white;
  font-size: 18rpx;
  padding: 4rpx 8rpx;
  border-radius: 12rpx;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
}

.member-distance {
  font-size: 32rpx;
  font-weight: bold;
  color: #165DFF;
  display: block;
  margin-bottom: 4rpx;
}

.member-rank {
  .rank-text {
    font-size: 24rpx;
    color: #86909C;
  }
}

.member-actions {
  .cheer-btn {
    width: 60rpx;
    height: 60rpx;
    background: rgba(255, 193, 7, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.9);
    }
    
    .cheer-icon {
      font-size: 24rpx;
    }
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: #F2F3F5;
  border-radius: 16rpx;
}

.activity-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.activity-user {
  font-size: 24rpx;
  font-weight: 600;
  color: #1D2129;
}

.activity-time {
  font-size: 20rpx;
  color: #86909C;
}

.activity-text {
  font-size: 28rpx;
  color: #4E5969;
  line-height: 1.4;
}

.activity-type {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  
  &.exercise {
    background: rgba(22, 93, 255, 0.1);
  }
  
  &.achievement {
    background: rgba(255, 193, 7, 0.1);
  }
  
  &.message {
    background: rgba(0, 180, 42, 0.1);
  }
}

.type-icon {
  font-size: 20rpx;
}

.team-actions {
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
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
    color: white;
    box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
  }
  
  &.secondary {
    background: white;
    color: #86909C;
    border: 2rpx solid #E5E6EB;
  }
  
  &.danger {
    background: #FF4757;
    color: white;
  }
  
  &:active {
    transform: translateY(2rpx);
  }
}

// 弹窗样式
.popup-overlay {
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

.popup {
  background: white;
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
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
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 28rpx;
  color: #1D2129;
  display: block;
  margin-bottom: 16rpx;
}

input, .picker-item {
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