<template>
  <view class="page">
    <!-- 顶部大图 -->
    <view class="hero-section">
      <image
        class="hero-image"
        :src="challengeDetail.image"
        mode="aspectFill"
      ></image>
      <view
        class="like-btn"
        :class="{ liked: challengeDetail.isLiked }"
        @click.stop="toggleLike"
      >
        <image
          v-if="challengeDetail.isLiked"
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
        <text class="main-title">{{ challengeDetail.title }}</text>
      </view>

      <!-- 副标题描述 -->
      <view class="subtitle-section">
        <text class="subtitle-text">{{ challengeDetail.description }}</text>
      </view>

      <!-- 相关商品/装备推荐 -->
      <view class="products-grid">
        <view
          v-for="product in relatedProducts"
          :key="product.id"
          class="product-card"
          @click="handleProductClick(product.id)"
        >
          <image
            class="product-image"
            :src="product.image"
            mode="aspectFill"
          ></image>
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-price">¥{{ product.price }}</text>
            <button class="buy-btn" @click.stop="handleBuyProduct(product.id)">
              <text class="buy-text">购买</text>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 页面参数
const challengeId = ref("");

// 挑战详情数据
const challengeDetail = ref({
  id: 1,
  title: "这是一个主标题",
  description:
    "这是一段副标题这是一段副标题这是一段副标题这是一段副标题这是一段副标题",
  image: "/static/challenges/great-wall.jpg",
  isLiked: false,
  introduction:
    "万里长城是中国古代军事防御工程的杰出代表，也是世界文化遗产。这个挑战将带你领略长城的壮丽风光，感受古代劳动人民的智慧与汗水。",
  rules:
    "1. 每日完成指定的运动量\n2. 记录并分享你的挑战进度\n3. 与其他参与者互动交流\n4. 坚持完成全程挑战",
  rewards:
    "完成挑战后，你将获得：\n• 专属长城徽章\n• 挑战证书\n• 积分奖励\n• 实物纪念品",
  participants: "1.2k",
  duration: "30天",
  difficulty: "中等",
});

// 相关商品数据
const relatedProducts = ref([
  {
    id: 1,
    name: "产品规格名称产品规格名称产品规格名称",
    price: 99,
    image: "/static/challenges/great-wall.jpg",
  },
  {
    id: 2,
    name: "产品规格名称产品规格名称产品规格名称",
    price: 99,
    image: "/static/challenges/great-wall.jpg",
  },
  {
    id: 3,
    name: "产品规格名称产品规格名称产品规格名称",
    price: 99,
    image: "/static/challenges/great-wall.jpg",
  },
  {
    id: 4,
    name: "产品规格名称产品规格名称产品规格名称",
    price: 99,
    image: "/static/challenges/great-wall.jpg",
  },
]);

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

const joinChallenge = () => {
  // 加入挑战逻辑
  uni.showToast({
    title: "加入挑战成功！",
    icon: "success",
    duration: 2000,
  });

  // 延迟跳转到我的运动页面
  setTimeout(() => {
    uni.switchTab({ url: "/pages/my-sports/index" });
  }, 2000);
};

const toggleLike = () => {
  challengeDetail.value.isLiked = !challengeDetail.value.isLiked;
  uni.showToast({
    title: challengeDetail.value.isLiked ? "已收藏" : "已取消收藏",
    icon: "none",
    duration: 1500,
  });
};

const handleProductClick = (productId: number) => {
  console.log("点击商品:", productId);
  // 这里可以跳转到商品详情页
  // uni.navigateTo({ url: `/pages/product-detail/index?id=${productId}` });
};

const handleBuyProduct = (productId: number) => {
  uni.navigateTo({
    url: `/pages/order-detail/index?productId=${productId}`,
  });
};

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;

  // 从 URL 参数获取 challengeId 或 projectId
  if (currentPage.options?.projectId) {
    challengeId.value = currentPage.options.projectId;
  } else if (currentPage.options?.id) {
    challengeId.value = currentPage.options.id;
  }

  // 根据 ID 加载对应的挑战详情
  loadChallengeDetail();
});

const loadChallengeDetail = () => {
  // 这里可以根据 challengeId 加载不同的挑战详情
  // 暂时使用 mock 数据
  console.log("加载挑战详情，ID:", challengeId.value);
};
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
  margin-bottom: 40rpx;
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
  color: rgba(0, 0, 0, 0.85);
  line-height: normal;
  margin-bottom: 16rpx;
  display: block;
}

.product-price {
  font-size: 44rpx;
  font-weight: 500;
  color: #7B412D;
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
</style>
