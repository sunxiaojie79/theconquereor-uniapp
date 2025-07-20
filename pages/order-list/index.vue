<template>
  <view class="page">
    <!-- 订单分类Tab -->
    <view class="order-tabs">
      <view
        v-for="(tab, index) in orderTabs"
        :key="index"
        class="tab-item"
        :class="{ active: selectedTab === index }"
        @click="switchTab(index)"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view
        v-for="order in orderList"
        :key="order.id"
        class="order-item"
        :style="{ height: order.status === 'completed' ? '232rpx' : '328rpx' }"
      >
        <!-- 商品信息 -->
        <view class="product-info">
          <view class="product-top">
            <text class="product-name">{{ order.challengeTitle }}</text>
            <text class="product-status">{{
              getStatusText(Number(order.orderStatus))
            }}</text>
          </view>
          <view class="product-bottom">
            <image
              class="product-image"
              :src="order.productCover"
              mode="aspectFill"
            ></image>
            <view class="product-bottom-right">
              <view class="product-bottom-right-top">
                <text class="product-spec"
                  >规格：{{ order.productDescription }}</text
                >
                <text class="product-price">¥{{ order.totalPrice }}</text>
              </view>

              <view
                v-if="
                  order.status !== 'pending' && order.status !== 'cancelled'
                "
                class="product-code"
              >
                <text class="code-label">code：{{ order.code }}</text>
                <view class="copy-btn" @click="copyCode(order.code)">
                  <text class="copy-text">复制</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view v-if="order.status !== 'completed'" class="order-actions">
          <!-- 待支付 -->
          <view v-if="order.status === 'pending'" class="action-buttons">
            <view class="action-btn primary" @click="payOrder(order.id)">
              <text class="btn-text">立即支付</text>
            </view>
          </view>

          <!-- 待发货 -->
          <view v-if="order.status === 'shipped'" class="action-buttons">
            <view class="action-btn primary" @click="joinChallenge(order.id)">
              <text class="btn-text">加入挑战</text>
            </view>
          </view>

          <!-- 待收货 -->
          <view v-if="order.status === 'delivered'" class="action-buttons">
            <view class="action-btn secondary" @click="viewLogistics(order.id)">
              <text class="btn-text">查看物流</text>
            </view>
            <view class="action-btn primary" @click="joinChallenge(order.id)">
              <text class="btn-text">加入挑战</text>
            </view>
          </view>

          <!-- 交易取消 -->
          <view v-if="order.status === 'cancelled'" class="action-buttons">
            <view class="action-btn secondary" @click="deleteOrder(order.id)">
              <text class="btn-text">删除订单</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { imgBaseUrl } from "@/config/dev.env";

// 响应式数据
const selectedTab = ref(0);
const orderList = ref([]);

// 订单分类
const orderTabs = [
  { label: "全部", key: "" },
  { label: "待支付", key: 0 },
  { label: "待发货", key: "shipped" },
  { label: "待收货", key: "delivered" },
  { label: "完成/取消", key: "finished" },
];

// 切换tab
const switchTab = (index: number) => {
  selectedTab.value = index;
};

// 获取状态文本
const getStatusText = (status: number) => {
  // 0 - 项目待支付 1 - 待绑定 2 - 待挑战 3 - 挑战中 4 - 挑战成功 5 - 关闭
  //待支付 - WAIT_PAY 已支付 - PAID 关闭 - CLOSE 待发货 - WAIT_DELIVER 待收货 - WAIT_RECEIVE 完成 - DONE
  const statusMap = {
    0: "待支付",
    1: "待绑定",
    2: "待挑战",
    3: "挑战中",
    4: "挑战成功",
    5: "关闭",
  };
  return statusMap[status] || status;
};

// 复制code
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

// 支付订单
const payOrder = (orderId: string) => {
  uni.showToast({
    title: "跳转支付...",
    icon: "loading",
  });
  // 这里可以调用支付接口
};

// 加入挑战
const joinChallenge = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/order-detail/index?orderId=${orderId}`,
  });
};

// 查看物流
const viewLogistics = (orderId: string) => {
  uni.showToast({
    title: "查看物流功能开发中",
    icon: "none",
  });
};

// 删除订单
const deleteOrder = (orderId: string) => {
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这个订单吗？",
    success: (res) => {
      if (res.confirm) {
        orderList.value = orderList.value.filter(
          (order) => order.id !== orderId
        );
        uni.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
};

// 初始化订单数据
const initOrderList = async () => {
  const res = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/my/order/list",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {
      query: {
        pageNum: 1,
        pageSize: 100,
      },
    },
  });
  console.log("🚀 ~ initOrderList ~ res:", res);
  if (res.data.code === 200) {
    res.data.rows.forEach((item: any) => {
      item.productCover = imgBaseUrl + item.productCover;
    });
    orderList.value = res.data.rows;
  } else {
    uni.showToast({
      title: "获取订单失败",
      icon: "none",
    });
  }
};

onMounted(() => {
  initOrderList();
  console.log("商品订单页面加载完成");
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f4f5f9;
  min-height: 100vh;
}

/* 订单分类Tab */
.order-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 32rpx 0;
  position: relative;

  &.active {
    .tab-text {
      color: #333;
      font-weight: 500;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 150rpx;
      height: 4rpx;
      background-color: #fadb47;
      border-radius: 2rpx;
    }
  }
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

/* 订单列表 */
.order-list {
}

.order-item {
  /* 自动布局子元素 */
  width: 750rpx;
  height: 328rpx;
  /* 自动布局 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32rpx 32rpx 0rpx 32rpx;
  background: #ffffff;
  box-sizing: border-box;
  border-width: 0rpx 0rpx 1rpx 0rpx;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.09);
  margin-bottom: 16rpx;
}

.product-info {
  width: 686rpx;
  height: 168rpx;
  display: flex;
  flex-direction: column;
}
.product-top {
  width: 686rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.product-name {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
.product-status {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.product-bottom {
  width: 686rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
}
.product-image {
  width: 96rpx;
  height: 96rpx;
  box-sizing: border-box;
  border: 1px solid #cdd5d7;
  margin-right: 16rpx;
}
.product-bottom-right {
  width: 574rpx;
  height: 96rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-bottom-right-top {
  width: 574rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.product-spec {
  width: 480rpx;
  height: 40rpx;
  line-height: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.product-price {
  font-size: 34rpx;
  font-weight: 500;
  color: #7b412d;
}

.product-code {
  width: 574rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-label {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.copy-btn {
  width: 64rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.45);
}

.copy-text {
  font-size: 24rpx;
  color: #242a36;
}

/* 操作按钮 */
.order-actions {
  padding-top: 24rpx;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.action-btn {
  width: 200rpx;
  height: 64rpx;
  padding: 20rpx 32rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  &.primary {
    background: #fadb47;

    .btn-text {
      color: #242a36;
      font-size: 34rpx;
      font-weight: 500;
    }
  }

  &.secondary {
    background: white;
    border: 2rpx solid rgba(0, 0, 0, 0.45);

    .btn-text {
      color: #242a36;
      font-size: 34rpx;
    }
  }
}

.btn-text {
  font-size: 28rpx;
}
</style>
