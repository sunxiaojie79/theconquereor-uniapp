<template>
  <view class="page">
    <!-- 问题详情内容 -->
    <view class="content">
      <view class="question-section">
        <view class="question-header">
          <view class="question-icon">
            <text class="icon-text">问</text>
          </view>
          <text class="question-title">{{ questionData.question }}</text>
        </view>
      </view>

      <view class="answer-section">
        <text class="answer-content">{{ questionData.answer }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 问题数据
const questionData = ref({
  id: 0,
  question: "",
  answer: "",
});

onMounted(() => {
  const currentFaq = uni.getStorageSync("currentFaq");
  questionData.value = currentFaq;
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  background: #3c3c43;
  padding-top: var(--status-bar-height, 44rpx);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.navbar-left {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
}

.back-icon {
  color: #fff;
  font-size: 48rpx;
  font-weight: normal;
  line-height: 1;
}

.navbar-center {
  flex: 1;
  text-align: center;
}

.navbar-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: 500;
}

.navbar-right {
  display: flex;
  gap: 15rpx;
}

.nav-icon-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.target-btn {
    background: rgba(255, 255, 255, 0.2);
  }
}

.nav-icon {
  color: #fff;
  font-size: 28rpx;
}

/* 内容区域 */
.content {
  background: #fff;
  // margin-top: calc(var(--status-bar-height, 44rpx) + 88rpx);
  min-height: calc(100vh - var(--status-bar-height, 44rpx) - 88rpx);
  padding: 40rpx 30rpx;
}

.question-section {
  margin-bottom: 60rpx;
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.question-icon {
  width: 60rpx;
  height: 60rpx;
  background: #ffd700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 6rpx;
}

.icon-text {
  color: #333;
  font-size: 28rpx;
  font-weight: 600;
}

.question-title {
  flex: 1;
  color: #333;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 8rpx;
}

.answer-section {
  background-color: #f4f5f9;
  border-radius: 20rpx;
  padding: 20rpx;
}

.answer-content {
  color: #666;
  font-size: 32rpx;
  line-height: 1.8;
  letter-spacing: 0.5rpx;
  text-align: justify;
}
</style>
