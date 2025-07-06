<template>
  <view class="page">
    <view class="setting-item">
      <view class="setting-item-title">
        <text>地址管理</text>
      </view>
      <image class="arrow-icon" src="/static/arrow-right-black.png" mode="aspectFill" @click="gotoAdressList"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
const gotoAdressList = () => {
  uni.navigateTo({
    url: `/pages/address-list/index`,
  });
};
</script>

<style lang="scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
}

.setting-item {
  width: 686rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0rpx;
  gap: 32rpx;
  align-self: stretch;
  z-index: 0;
  box-sizing: border-box;
  border-width: 0rpx 0rpx 1rpx 0rpx;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.09);
}
.arrow-icon {
  width: 24rpx;
  height: 24rpx;
}
</style>
