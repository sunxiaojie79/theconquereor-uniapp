<template>
  <view class="page">
    <!-- 地址信息区域 -->
    <view class="address-section">
      <view class="address-info" @click="handleEditAddress">
        <view class="address-header">
          <text class="address-location">{{
            currentAddress.province +
            currentAddress.city +
            currentAddress.district
          }}</text>
        </view>
        <view class="address-detail-container">
          <text class="address-detail">{{ currentAddress.address }}</text>
          <image
            class="arrow-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
        <text class="recipient-info">{{
          currentAddress.receiverName + " " + currentAddress.contact
        }}</text>
      </view>
    </view>

    <!-- 商品信息区域 -->
    <view class="product-section">
      <view class="product-header">
        <text class="product-name">{{ orderDetail.challengeTitle }}</text>
        <text class="order-status">{{
          getStatusText(orderDetail.orderStatus)
        }}</text>
      </view>

      <view class="product-content">
        <image
          class="product-image"
          :src="imgBaseUrl + orderDetail.orderDetailList[0].logo"
          mode="aspectFill"
        ></image>
        <view class="product-details">
          <text class="product-spec"
            >规格：{{ orderDetail.orderDetailList[0].title }}</text
          >
          <text class="product-price"
            >¥{{ orderDetail.orderDetailList[0].unitPrice }}</text
          >
        </view>
        <view
          v-if="
            orderDetail.orderStatus === 'WAIT_DELIVER' ||
            orderDetail.orderStatus === 'PAID' ||
            orderDetail.orderStatus === 'WAIT_RECEIVE'
          "
          class="product-code-container"
        >
          <image
            class="key-icon"
            src="/static/key.png"
            mode="aspectFill"
          ></image>
          <text class="product-code">
            {{ orderDetail.code }}
          </text>
          <view class="copy-btn" @click="copyCode(orderDetail.code)">
            <text class="copy-text">复制</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部支付按钮 -->
    <view v-if="orderDetail.orderStatus === 'WAIT_PAY'" class="btn-section">
      <button class="main-btn" @click="handlePayment">
        <text class="btn-text">立即支付</text>
      </button>
    </view>
    <view
      v-if="
        orderDetail.orderStatus === 'WAIT_DELIVER' ||
        orderDetail.orderStatus === 'PAID'
      "
      class="btn-section"
    >
      <button class="main-btn" @click="handleBind">
        <text class="btn-text">加入挑战</text>
      </button>
    </view>
    <view v-if="orderDetail.orderStatus === 'WAIT_RECEIVE'" class="btn-section">
      <button class="sub-btn" @click="handleLogistics">
        <text class="btn-text">查看物流</text>
      </button>
      <button class="primary-btn" @click="handleBind">
        <text class="btn-text">加入挑战</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { imgBaseUrl, baseurl } from "@/config/dev.env";
// 页面状态
const orderDetail = ref({
  challengeTitle: "",
  challengeId: "",
  orderDetailList: [],
  orderStatus: "",
  deliveryAddress: "",
  receiverName: "",
  contact: "",
  province: "",
  city: "",
  district: "",
  id: "",
  code: "",
});
const currentAddress = ref();
// 获取订单详情
const getOrderDetail = async (orderId: string) => {
  const res = await uni.request({
    url: baseurl + `/wx/app/my/order/detail/${orderId}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getOrderDetail ~ res:", res);
  if (res.data.code === 200) {
    orderDetail.value = res.data.data;
    currentAddress.value = {
      address: orderDetail.value.deliveryAddress,
      city: orderDetail.value.city,
      contact: orderDetail.value.contact,
      defaultFlag: false,
      district: orderDetail.value.district,
      province: orderDetail.value.province,
      receiverName: orderDetail.value.receiverName,
    };
    uni.setStorageSync("myCurrentAddress", currentAddress.value);
    uni.setNavigationBarTitle({
      title: getStatusText(orderDetail.value.orderStatus),
    });
  }
};
// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    WAIT_PAY: "待支付",
    PAID: "已支付",
    CLOSE: "关闭",
    WAIT_DELIVER: "待发货",
    WAIT_RECEIVE: "待收货",
    DONE: "完成",
  };
  return statusMap[status] || status;
};
const handleEditAddress = () => {
  if (orderDetail.value.orderStatus === "WAIT_PAY") {
    // 跳转到地址列表页面
    uni.navigateTo({
      url: "/pages/address-list/index",
    });
  }
};
const handleLogistics = () => {
  uni.showToast({
    title: "敬请期待",
    icon: "none",
  });
};

// 绑定挑战CODE
const handleBind = async () => {
  if (!orderDetail.value.code.trim()) {
    uni.showToast({
      title: "请输入挑战CODE",
      icon: "none",
    });
    return;
  }
  const res = await uni.request({
    url: baseurl + `/wx/app/bind/${orderDetail.value.code}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  uni.showLoading({
    title: "绑定中...",
  });
  console.log("🚀 ~ bindChallengeCode ~ res:", res);
  if (res.data.code === 200 && res.data.data !== false) {
    uni.showToast({
      title: "绑定成功",
      icon: "success",
    });
  } else {
    uni.showToast({
      title: "绑定失败",
      icon: "error",
    });
  }

  setTimeout(() => {
    uni.hideLoading();
    uni.navigateBack();
  }, 1000);
};
// 复制CODE
const copyCode = (code: string) => {
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
    fail: () => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
    },
  });
};
const handlePayment = async () => {
  const params = {
    appDeliveryAddress: {
      address: currentAddress.value.address,
      city: currentAddress.value.city,
      contact: currentAddress.value.contact,
      defaultFlag: currentAddress.value.defaultFlag,
      district: currentAddress.value.district,
      province: currentAddress.value.province,
      receiverName: currentAddress.value.receiverName,
    },
    orderId: orderDetail.value.id,
  };
  const res = await uni.request({
    url: baseurl + "/wx/pay/createOrder",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: params,
  });
  console.log("🚀 ~ handlePayment ~ res:", res);
  if (res.data.code === 200) {
    //   uni.showToast({
    //     title: "支付成功！",
    //     icon: "success",
    //     duration: 2000,
    //   });
    //   uni.navigateTo({
    //     url: `/pages/payment/index?codeUrl=${encodeURIComponent(
    //       res.data.data.codeUrl
    //     )}`,
    //   });
    // } else {
    //   uni.showToast({
    //     title: "支付失败！",
    //     icon: "none",
    //     duration: 2000,
    //   });
    const response = res.data.data.response;
    const { appId, nonceStr, packageValue, paySign, signType, timeStamp } =
      response;
    const params = {
      appId: appId,
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: packageValue,
      signType: signType,
      paySign: paySign,
    };
    console.log("🚀 ~ handlePayment ~ params:", params);
    wx.requestPayment({
      ...params,
      success: (res) => {
        console.log("🚀 ~ handlePayment ~ res:", res);
        uni.showToast({
          title: "支付成功！",
          icon: "success",
          duration: 2000,
        });
      },
      fail: (err) => {
        console.log("🚀 ~ handlePayment ~ err:", err);
        uni.showToast({
          title: "支付失败！",
          icon: "none",
          duration: 2000,
        });
      },
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
  if (currentPage.options?.orderId) {
    console.log("订单ID:", currentPage.options.orderId);
    getOrderDetail(currentPage.options.orderId);
  }
});
onShow(() => {
  console.log("onShow", uni.getStorageSync("myCurrentAddress"));
  currentAddress.value = uni.getStorageSync("myCurrentAddress");
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

.product-code-container {
  width: 100%;
  height: 88rpx;
  border-radius: 8rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  box-sizing: border-box;
  background: #f4f5f9;
}
.key-icon {
  width: 36rpx;
  height: 36rpx;
}
.product-code {
  width: 494rpx;
  // 换行
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.65);
  margin: 0 16rpx;
}
.copy-btn {
  width: 64rpx;
  height: 40rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 4rpx;
  background: #ffffff;
  box-sizing: border-box;
  border: 2rpx solid rgba(0, 0, 0, 0.45);
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
.btn-section {
  display: flex;
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

.main-btn {
  width: 100%;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  width: 392rpx;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sub-btn {
  width: 278rpx;
  height: 80rpx;
  background: #ffffff;
  border: 1rpx solid rgba(0, 0, 0, 0.45);
  border-radius: 8rpx;
  margin-right: 16rpx;
}
.btn-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}
</style>
