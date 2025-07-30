<template>
  <view class="page">
    <!-- 顶部大图 -->
    <view class="hero-section">
      <image
        class="hero-image"
        :src="challengeDetail.productCover"
        mode="aspectFill"
      ></image>
      <view class="navbar-content">
        <view
          class="status-bar"
          :style="{ height: statusBarHeight + 'px' }"
        ></view>
        <view class="navbar-left" @click="goBack">
          <image
            class="back-icon"
            src="/static/arrow-left.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view
        class="like-btn"
        :class="{ liked: challengeDetail.collectFlag }"
        @click.stop="toggleLike"
      >
        <image
          v-if="challengeDetail.collectFlag"
          class="like-icon"
          src="/static/heart-fill.png"
          mode="aspectFill"
        ></image>
        <image
          v-else
          class="like-icon"
          src="/static/heart-empty.png"
          mode="aspectFill"
        ></image>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 主标题 -->
      <view class="title-section">
        <text class="main-title">{{ challengeDetail.challengeTitle }}</text>
      </view>

      <!-- 副标题描述 -->
      <view class="subtitle-section">
        <text class="subtitle-text">{{ challengeDetail.subtitle }}</text>
      </view>

      <!-- 相关商品/装备推荐 -->
      <view class="products-grid">
        <view
          v-for="product in challengeDetail.productSpecificationList"
          :key="product.id"
          class="product-card"
          @click="handleProductClick(product.id)"
        >
          <image
            class="product-image"
            :src="product.logo"
            mode="aspectFill"
          ></image>
          <view class="product-info">
            <text class="product-name">{{ product.title }}</text>
            <text class="product-price">¥{{ product.price }}</text>
            <button class="buy-btn" @click.stop="handleBuyProduct(product)">
              <text class="buy-text">购买</text>
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部安全区域 -->
    <view
      class="safe-area-bottom"
      :style="{ height: safeAreaBottom + 'px' }"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { imgBaseUrl, baseurl } from "@/config/dev.env";
// 页面参数
const challengeId = ref("");
const statusBarHeight = ref(44);
const safeAreaBottom = ref(34);

// 挑战详情数据
const challengeDetail = ref({
  challengeTitle: "",
  collectFlag: false,
  cooperationAuthorization: "",
  distance: 0,
  id: "",
  params: {},
  productCover: "",
  productDescription: "",
  productSpecificationList: [
    {
      challengeId: "",
      discount: 0,
      id: "",
      logo: "",
      params: {},
      price: 0,
      title: "",
    },
  ],
  scenicSpotList: [{}],
  subtitle: "",
});

// 接口
// 获取挑战详情
const getChallengeDetail = async () => {
  const res: any = await uni.request({
    url: baseurl + `/wx/app/challengeProject/detail/${challengeId.value}`,
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getChallengeDetail ~ res:", res);
  if (res.data.code === 200) {
    challengeDetail.value = res.data.data;
    challengeDetail.value.productCover =
      imgBaseUrl + challengeDetail.value.productCover;
    challengeDetail.value.productSpecificationList.forEach((item: any) => {
      item.logo = imgBaseUrl + item.logo;
    });
  }
  return res.data;
};
// 方法
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({
      fail: () => {
        uni.switchTab({ url: "/pages/index/index" });
      },
    });
  } else {
    uni.switchTab({ url: "/pages/index/index" });
  }
};
// 收藏挑战项目
const likeCollection = async (id) => {
  const res: any = await uni.request({
    url: baseurl + `/wx/app/my/collection/${id}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getMyCollection ~ res:", res);
  return res.data;
};
// 取消收藏挑战项目
const cancelCollection = async (id) => {
  const res: any = await uni.request({
    url: baseurl + `/wx/app/my/collection/remove/${id}`,
    method: "DELETE",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  return res.data;
};
const toggleLike = async () => {
  console.log(
    "🚀 ~ toggleLike ~ challengeDetail.value.collectFlag:",
    challengeDetail.value.collectFlag
  );
  if (challengeDetail.value.collectFlag) {
    const res = await cancelCollection(challengeDetail.value.id);
    console.log("🚀 ~ cancelCollection ~ res:", res);
    if (res.code === 200) {
      challengeDetail.value.collectFlag = false;
    }
  } else {
    const res = await likeCollection(challengeDetail.value.id);
    console.log("🚀 ~ likeCollection ~ res:", res);
    if (res.code === 200) {
      challengeDetail.value.collectFlag = true;
    }
  }
};

const handleProductClick = (productId: string) => {
  console.log("点击商品:", productId);
  // 这里可以跳转到商品详情页
  // uni.navigateTo({ url: `/pages/product-detail/index?id=${productId}` });
};

const handleBuyProduct = (product: any) => {
  uni.setStorageSync("currentProduct", product);
  uni.navigateTo({
    url: `/pages/order-detail/index?challengeTitle=${challengeDetail.value.challengeTitle}&challengeId=${challengeDetail.value.id}`,
  });
};
// 获取系统信息
const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 34;
};
// 获取页面参数
onMounted(() => {
  getSystemInfo();
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log("🚀 ~ onMounted ~ currentPage:", currentPage);

  // 从 URL 参数获取 challengeId 或 projectId
  if (currentPage.options?.projectId) {
    challengeId.value = currentPage.options.projectId;
  } else if (currentPage.options?.id) {
    challengeId.value = currentPage.options.id;
  }
  getChallengeDetail();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242a36;
  min-height: 100vh;
  color: #ffffff;
}

/* 顶部大图区域 */
.hero-section {
  position: relative;
  height: 436rpx;
  width: 750rpx;
  overflow: hidden;
}
.navbar-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.status-bar {
  width: 100%;
}

.navbar-left {
  margin-left: 32rpx;
  margin-top: 20rpx;
}

.back-icon {
  height: 48rpx;
  width: 24rpx;
}
.hero-image {
  width: 100%;
  height: 100%;
}

.like-btn {
  position: absolute;
  bottom: 12rpx;
  right: 32rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
  .like-icon {
    width: 48rpx;
    height: 48rpx;
  }
}
/* 主要内容区域 */
.content {
  padding: 48rpx 32rpx;
}

/* 主标题 */
.title-section {
  text-align: center;
  margin-bottom: 24rpx;
}

.main-title {
  font-size: 40rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: normal;
}

/* 副标题 */
.subtitle-section {
  text-align: center;
  margin-bottom: 48rpx;
}

.subtitle-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: normal;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.product-card {
  width: 331rpx;
  height: 520rpx;
  background: #ffffff;
  border-radius: 8rpx;
  overflow: hidden;
  padding-bottom: 24rpx;
  box-sizing: border-box;
}

.product-image {
  width: 100%;
  height: 204rpx;
  margin-bottom: 24rpx;
}

.product-info {
  padding: 0 16rpx;
}

.product-name {
  font-size: 28rpx;
  height: 80rpx;
  color: rgba(0, 0, 0, 0.85);
  line-height: normal;
  margin-bottom: 16rpx;
  display: block;
}

.product-price {
  font-size: 44rpx;
  font-weight: 500;
  color: #7b412d;
  margin-bottom: 24rpx;
  display: block;
}

.buy-btn {
  width: 100%;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buy-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}
/* 底部安全区域 */
.safe-area-bottom {
  width: 100%;
}
</style>
