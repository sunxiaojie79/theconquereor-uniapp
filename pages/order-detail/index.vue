<template>
  <view class="page">
    <!-- 地址信息区域 -->
    <view class="address-section">
      <!-- 无地址状态 -->
      <view
        v-if="!hasAddress"
        class="create-address"
        @click="handleCreateAddress"
      >
        <text class="create-address-text">创建地址</text>
        <image
          class="arrow-icon"
          src="/static/arrow-right-black.png"
          mode="aspectFill"
        ></image>
      </view>

      <!-- 有地址状态 -->
      <view v-else class="address-info" @click="handleEditAddress">
        <view class="address-header">
          <view class="default-tag">默认</view>
          <text class="address-location">广东省广州市黄埔区</text>
        </view>
        <view class="address-detail-container">
          <text class="address-detail">这是一个算详细地址详情</text>
          <image
            class="arrow-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
        <text class="recipient-info">收件人 13612345678</text>
      </view>
    </view>

    <!-- 商品信息区域 -->
    <view class="product-section">
      <view class="product-header">
        <text class="product-name">{{ challengeTitle }}</text>
        <text class="order-status">待支付</text>
      </view>

      <view class="product-content">
        <image
          class="product-image"
          :src="productInfo.image"
          mode="aspectFill"
        ></image>
        <view class="product-details">
          <text class="product-spec">规格：{{ productInfo.title }}</text>
          <text class="product-price">¥{{ productInfo.price }}</text>
        </view>
      </view>
    </view>
    <!-- 底部支付按钮 -->
    <view class="pay-section">
      <button class="pay-btn" @click="handlePayment">
        <text class="pay-text">立即支付</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// 页面状态
const hasAddress = ref(true);
const productInfo = ref(uni.getStorageSync("currentProduct"));
const challengeTitle = ref("");
const challengeId = ref("");
// 方法
const handleCreateAddress = () => {
  // 跳转到地址列表页面
  uni.navigateTo({
    url: "/pages/address-edit/index",
  });
};

const handleEditAddress = () => {
  // 跳转到地址列表页面
  uni.navigateTo({
    url: "/pages/address-list/index",
  });
};

const handlePayment = async () => {
  if (!hasAddress.value) {
    uni.showToast({
      title: "请先创建收货地址",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  const params = {
    appDeliveryAddress: {
      address: "555",
      city: "长春市",
      contact: "13333333333",
      defaultFlag: false,
      district: "南关区",
      id: "1946548578777890817",
      province: "吉林省",
      receiverName: "test",
    },
    challengeId: challengeId.value,
    productId: productInfo.value.id,
  };
  const res = await uni.request({
    url: "http://113.45.219.231:8005//prod-api/wx/pay/createOrder",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: params,
  });
  console.log("🚀 ~ handlePayment ~ res:", res);
  if (res.data.code === 200) {
    uni.showToast({
      title: "支付成功！",
      icon: "success",
      duration: 2000,
    });
    uni.navigateTo({
      url: `/pages/payment/index?codeUrl=${encodeURIComponent(
        res.data.data.codeUrl
      )}`,
    });
  } else {
    uni.showToast({
      title: "支付失败！",
      icon: "none",
      duration: 2000,
    });
  }

  // 延迟跳转
  // setTimeout(() => {
  //   uni.navigateBack();
  // }, 2000);
};

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;

  // 从 URL 参数获取商品信息
  if (currentPage.options?.challengeTitle) {
    challengeTitle.value = currentPage.options.challengeTitle;
    challengeId.value = currentPage.options.challengeId;
    console.log("挑战标题:", challengeTitle, challengeId);
  }
});

onUnmounted(() => {
  uni.removeStorageSync("currentProduct");
});
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
  // padding-bottom: 120rpx;
  box-sizing: border-box;
}

/* 地址信息区域 */
.address-section {
  background: #ffffff;
  margin-bottom: 20rpx;
}

.create-address {
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;
}

.create-address-text {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
}

.address-info {
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.default-tag {
  background: #fadb47;
  color: #242a36;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.address-location {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
  flex: 1;
}

.address-detail-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-detail {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8rpx;
  display: block;
}

.recipient-info {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.85);
  display: block;
}

/* 商品信息区域 */
.product-section {
  background: #ffffff;
  padding: 32rpx;
  flex: 1;
  padding-bottom: 200rpx;
}

.product-header {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 32rpx;
  margin-bottom: 32rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.09);
}

.product-name {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  flex: 1;
}

.order-status {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.product-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24rpx;
}

.product-image {
  width: 240rpx;
  height: 240rpx;
  border: 1px solid #cdd5d7;
  margin-bottom: 24rpx;
}

.product-details {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-spec {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: block;
}

.product-price {
  font-size: 44rpx;
  color: #7b412d;
  font-weight: 500;
  display: block;
  text-align: right;
}

/* 底部支付按钮 */
.pay-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180rpx;
  background: #ffffff;
  padding: 32rpx 32rpx 68rpx 32rpx;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}

.pay-btn {
  width: 100%;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}
</style>
