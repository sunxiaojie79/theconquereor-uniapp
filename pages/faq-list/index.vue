<template>
  <view class="page">
    <!-- 问题列表 -->
    <view class="faq-content">
      <view class="faq-list">
        <view
          v-for="faq in faqList"
          :key="faq.id"
          class="faq-item"
          @click="handleFaqClick(faq)"
        >
          <text class="faq-question">{{ faq.question }}</text>
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { baseurl } from "@/config/dev.env";

// FAQ数据
const faqList = ref([]);
// 获取Q&A列表
const getFaqList = async () => {
  const res: any = await uni.request({
    url: baseurl + "/wx/app/qa/list",
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getFaqList ~ res:", res);
  if (res.data.code === 200) {
    faqList.value = res.data.data;
  }
};
// 方法

const handleFaqClick = (faq: any) => {
  console.log("点击FAQ:", faq);
  uni.setStorageSync("currentFaq", faq);
  // 跳转到问题详情页面
  uni.navigateTo({
    url: `/pages/faq-detail/index?id=${faq.id}`,
  });
};
onMounted(() => {
  getFaqList();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  background: #242a36;
  padding-top: var(--status-bar-height, 44rpx);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.navbar-content {
  height: 120rpx;
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
}

.nav-icon {
  font-size: 28rpx;
}

/* 内容区域 */
.faq-content {
  background: #fff;
  // margin-top: calc(var(--status-bar-height, 44rpx) + 88rpx);
  min-height: calc(100vh - var(--status-bar-height, 44rpx) - 88rpx);
}

.faq-list {
  padding: 0;
  padding-bottom: 40rpx;
}

.faq-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 48rpx 30rpx;
  border-bottom: 1rpx solid #e8e8e8;
  background: #fff;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
}

.faq-question {
  color: #333;
  font-size: 32rpx;
  line-height: 1.5;
  flex: 1;
  margin-right: 20rpx;
}

.arrow-icon {
  color: #999;
  font-size: 32rpx;
  font-weight: normal;
}
</style>
