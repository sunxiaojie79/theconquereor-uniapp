<template>
  <view class="result-page">
    <!-- 顶部成功状态区域 -->
    <view class="success-section">
      <view class="success-container">
        <image
          class="success-icon-image"
          src="/static/success-icon.png"
          mode="aspectFill"
        ></image>
        <text class="success-title">添加成功</text>
      </view>

      <text class="success-desc">您的距离已发布</text>
    </view>

    <!-- 中间卡片区域 -->
    <view class="card-section">
      <view class="challenge-card">
        <view class="card-image-container">
          <image
            class="challenge-image"
            :src="challengeData.productCover"
            mode="aspectFill"
          ></image>
          <view class="image-overlay">
            <image
              class="overlay-circle"
              :src="challengeData.productCover"
              mode="aspectFill"
            ></image>
          </view>
        </view>
        <view class="card-content">
          <text class="challenge-title">{{
            challengeData.challengeProjectTitle
          }}</text>
          <view class="card-footer">
            <text class="distance">{{ challengeData.distance }}km</text>
            <text class="date">{{ challengeData.dateDisplay }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 进度展示区域 -->
    <view class="progress-section">
      <text class="progress-title">继续前进</text>
      <view class="progress-info">
        <text class="progress-text">还剩 </text>
        <text class="remaining-distance"
          >{{ challengeData.distance || "5.00" }}km</text
        >
        <text class="progress-text"> 解锁下一个里程碑</text>
      </view>
    </view>

    <!-- 底部按钮区域 -->
    <view class="bottom-section">
      <button class="back-btn" @click="goBackToMap">返回挑战地图</button>
      <button class="add-btn" @click="addSportsData('hand')">
        继续添加公里数
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { imgBaseUrl } from "@/config/dev.env";

// 响应式数据
const challengeData = ref({
  distance: "",
  productCover: "",
  challengeProjectTitle: "",
  dateDisplay: "",
  challengeProjectId: "",
});

// 返回挑战地图
const goBackToMap = () => {
  uni.navigateTo({
    url: `/pages/route-detail/index?id=${challengeData.value.challengeProjectId}`,
  });
};

// 添加更多运动数据
const addSportsData = (type: string) => {
  uni.redirectTo({
    url: `/pages/add-sports-data/index?type=${type}`,
  });
};
// 转换距离
const convertDistance = (distance: number) => {
  return distance.toFixed(2);
};
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log("🚀 ~ onMounted ~ currentPage:", currentPage.options);

  // 获取页面参数
  if (currentPage.options) {
    challengeData.value = {
      distance: convertDistance(Number(currentPage.options.distance)),
      productCover: imgBaseUrl + currentPage.options.productCover,
      challengeProjectTitle: currentPage.options.challengeProjectTitle,
      dateDisplay: currentPage.options.dateDisplay,
      challengeProjectId: currentPage.options.challengeProjectId,
    };
  }
});
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: #242a36;
  display: flex;
  flex-direction: column;
  padding: 0 32rpx;
  box-sizing: border-box;
}

/* 顶部成功状态区域 */
.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 0 48rpx 0;
}

.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50rpx;
  margin-bottom: 8rpx;
}

.success-icon-image {
  width: 34rpx;
  height: 34rpx;
  object-fit: contain;
  margin-right: 12rpx;
}

.success-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #fadb47;
}

.success-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 中间卡片区域 */
.card-section {
  width: 686rpx;
  height: 382rpx;
  border-radius: 8rpx;
  margin-bottom: 48rpx;
}

.challenge-card {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 176rpx;
}

.challenge-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-circle {
  width: 120rpx;
  height: 120rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
}

.card-content {
  padding: 24rpx;
  height: 206rpx;
  box-sizing: border-box;
}

.challenge-title {
  font-size: 34rpx;
  font-weight: 500;
  height: 100rpx;
  overflow: hidden;
  color: #242a36;
  line-height: 1.4;
  margin-bottom: 8rpx;
  display: block;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distance {
  font-size: 36rpx;
  font-weight: 700;
  color: #7b412d;
}

.date {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

/* 进度展示区域 */
.progress-section {
  width: 686rpx;
  height: 170rpx;
  background-color: #313743;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx;
  box-sizing: border-box;
}

.progress-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.progress-info {
  display: flex;
  align-items: center;
}

.progress-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
}

.remaining-distance {
  font-size: 28rpx;
  font-weight: 600;
  color: #fadb47;
  margin: 0 8rpx;
}

/* 底部按钮区域 */
.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom)) 32rpx;
  background: #fff;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  flex: 1;
  height: 88rpx;
  background: transparent;
  border: 2rpx solid rgba(0, 0, 0, 0.45);
  border-radius: 12rpx;
  font-size: 32rpx;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }
}

.add-btn {
  flex: 1;
  height: 88rpx;
  background: #fadb47;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #242a36;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }
}
</style>
