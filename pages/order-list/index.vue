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
      <view v-for="order in filteredOrders" :key="order.id" class="order-item" :style="{ height: order.status === 'completed' ? '232rpx' : '328rpx' }">
        <!-- 商品信息 -->
        <view class="product-info">
          <view class="product-top">
            <text class="product-name">{{ order.productName }}</text>
            <text class="product-status">{{
              getStatusText(order.status)
            }}</text>
          </view>
          <view class="product-bottom">
            <image
              class="product-image"
              :src="order.productImage"
              mode="aspectFill"
            ></image>
            <view class="product-bottom-right">
              <view class="product-bottom-right-top">
                <text class="product-spec"
                  >规格：{{ order.specification }}</text
                >
                <text class="product-price">¥{{ order.price }}</text>
              </view>

              <view
                v-if="
                  order.status !== 'pending' && order.status !== 'cancelled'
                "
                class="product-code"
              >
                <text class="code-label">code：{{ order.challengeCode }}</text>
                <view class="copy-btn" @click="copyCode(order.challengeCode)">
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
            <view
              class="action-btn primary"
              @click="joinChallenge(order.challengeCode)"
            >
              <text class="btn-text">加入挑战</text>
            </view>
          </view>

          <!-- 待收货 -->
          <view v-if="order.status === 'delivered'" class="action-buttons">
            <view class="action-btn secondary" @click="viewLogistics(order.id)">
              <text class="btn-text">查看物流</text>
            </view>
            <view
              class="action-btn primary"
              @click="joinChallenge(order.challengeCode)"
            >
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
import { ref, computed, onMounted } from "vue";

// 响应式数据
const selectedTab = ref(0);
const orderList = ref([]);

// 订单分类
const orderTabs = [
  { label: "全部", key: "all" },
  { label: "待支付", key: "pending" },
  { label: "待发货", key: "shipped" },
  { label: "待收货", key: "delivered" },
  { label: "完成/取消", key: "finished" },
];

// 计算属性 - 根据选中的tab过滤订单
const filteredOrders = computed(() => {
  const currentTab = orderTabs[selectedTab.value];
  if (currentTab.key === "all") {
    return orderList.value;
  } else if (currentTab.key === "finished") {
    return orderList.value.filter(
      (order) => order.status === "completed" || order.status === "cancelled"
    );
  } else {
    return orderList.value.filter((order) => order.status === currentTab.key);
  }
});

// 切换tab
const switchTab = (index: number) => {
  selectedTab.value = index;
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    pending: "待支付",
    shipped: "待发货",
    delivered: "待收货",
    completed: "交易完成",
    cancelled: "交易取消",
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
const joinChallenge = (challengeCode: string) => {
  uni.navigateTo({
    url: `/pages/join-challenge/index?code=${challengeCode}`,
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
const initOrderList = () => {
  const mockOrders = [
    // 待支付订单
    {
      id: "1",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/great-wall.jpg",
      specification: "规格文案",
      price: "99",
      status: "pending",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
    // 待发货订单
    {
      id: "2",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/silk-road.jpg",
      specification: "规格文案规格文案规格文案规...",
      price: "99",
      status: "shipped",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
    // 待收货订单
    {
      id: "3",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/sahara.jpg",
      specification: "规格文案",
      price: "99",
      status: "delivered",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
    // 交易完成订单
    {
      id: "4",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/amazon.jpg",
      specification: "规格文案",
      price: "99",
      status: "completed",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
    {
      id: "5",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/great-wall.jpg",
      specification: "规格文案",
      price: "99",
      status: "completed",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
    // 交易取消订单
    {
      id: "6",
      productName: "产品名称产品名称产品名称",
      productImage: "/static/challenges/silk-road.jpg",
      specification: "规格文案",
      price: "99",
      status: "cancelled",
      challengeCode: "DGDFGDFHFGDSFDGHFDG",
    },
  ];

  orderList.value = mockOrders;
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
      color: #242A36;
      font-size: 34rpx;
      font-weight: 500;
    }
  }

  &.secondary {
    background: white;
    border: 2rpx solid rgba(0, 0, 0, 0.45);

    .btn-text {
      color: #242A36;
      font-size: 34rpx;
    }
  }
}

.btn-text {
  font-size: 28rpx;
}
</style>
