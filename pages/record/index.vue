<template>
  <view class="page">
    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tabs">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'add' }"
          @click="switchTab('add')"
        >
          <text class="tab-text">添加数据</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'data' }"
          @click="switchTab('data')"
        >
          <text class="tab-text">运动数据</text>
        </view>
      </view>
    </view>

    <!-- 添加数据页面 -->
    <view v-if="activeTab === 'add'" class="add-data-content">
      <!-- 添加运动数据卡片 -->
      <view class="add-data-card" @click="addSportsData">
        <view class="card-left">
          <image class="card-icon" src="/static/distance-active.png" mode="aspectFill"></image>
        </view>
        <view class="card-content">
          <text class="card-title">添加运动数据</text>
          <text class="card-desc">添加距离、步数或转换活动类型</text>
        </view>
        <view class="card-right">
          <image class="arrow-icon" src="/static/arrow-right-black.png" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 已授权的运动APP -->
      <view class="authorized-section">
        <text class="section-title">已授权的运动APP</text>
        <view class="app-item-container">
          <view class="app-list">
          <view class="app-item">
            <image class="app-icon" src="/static/wechat.png" mode="aspectFill"></image>
            <text class="app-name">微信计步器</text>
          </view>
        </view>

        <!-- 添加新授权按钮 -->
        <button class="add-auth-btn" @click="addNewAuth">
          <text class="add-auth-text">添加新授权</text>
        </button>
        </view>
        
      </view>
    </view>

    <!-- 运动数据页面 -->
    <view v-if="activeTab === 'data'" class="sports-data-content">
      <view class="data-empty">
        <image class="empty-icon" src="/static/icons/empty.png" mode="aspectFill"></image>
        <text class="empty-text">暂无运动数据</text>
        <text class="empty-desc">开始记录您的运动数据吧</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const activeTab = ref('add')

// 方法
const switchTab = (tab: string) => {
  activeTab.value = tab
}

const addSportsData = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const addNewAuth = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  console.log('记录页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #242A36;
  min-height: 100vh;
  color: #ffffff;
}

/* Tab切换样式 - 参考challenge-list页面 */
.tab-section {
  padding: 40rpx 30rpx 0 30rpx;
}

.tabs {
  display: flex;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 24rpx;
  position: relative;

  &.active {
    .tab-text {
      color: #fadb47;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #fadb47;
    }
  }
}

.tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #999;
}

/* 添加数据页面内容 */
.add-data-content {
  padding: 40rpx 30rpx;
}

.add-data-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 60rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-left {
  margin-right: 24rpx;
}

.card-icon {
  width: 48rpx;
  height: 48rpx;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.card-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.4;
}

.card-right {
  margin-left: 24rpx;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

/* 已授权的运动APP */
.authorized-section {
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 32rpx;
  display: block;
}
.app-item-container{
  
  padding: 32rpx;
  border-radius: 8rpx;
background: #313743;
}
.app-list {
  margin-bottom: 32rpx;
}

.app-item {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;
}

.app-name {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

.add-auth-btn {
  width: 100%;
  height: 88rpx;
  background-color: transparent;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  
  &::after {
    border: none;
  }
}

.add-auth-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

/* 运动数据页面内容 */
.sports-data-content {
  padding: 100rpx 30rpx;
}

.data-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999999;
  opacity: 0.8;
}
</style> 