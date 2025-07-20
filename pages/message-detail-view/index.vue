<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <image
        class="navbar-bg"
        :src="imgBaseUrl + contentInfo.appChallengeProject.productCover"
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
    </view>

    <!-- 内容区域 -->
    <view class="content-section">
      <view class="content-header">
        <text class="content-title">{{
          contentInfo.appChallengeProject.challengeTitle
        }}</text>
        <text class="content-description">{{
          contentInfo.appChallengeProject.productDescription
        }}</text>
      </view>

      <!-- Tab切换 -->
      <view class="tab-section">
        <view class="tabs">
          <view
            class="tab-item"
            :class="{ active: activeTab === 'photo' }"
            @click="switchTab('photo')"
          >
            <text class="tab-text">照片</text>
            <view v-if="activeTab === 'photo'" class="tab-line"></view>
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'video' }"
            @click="switchTab('video')"
          >
            <text class="tab-text">视频</text>
            <view v-if="activeTab === 'video'" class="tab-line"></view>
          </view>
        </view>
      </view>

      <!-- 照片列表 -->
      <view v-if="activeTab === 'photo'" class="media-grid">
        <view
          v-for="(photo, index) in photoList"
          :key="photo.id"
          class="media-item"
          @click="previewPhoto(index)"
        >
          <image class="media-image" :src="photo.url" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 视频列表 -->
      <view v-if="activeTab === 'video'" class="media-grid">
        <view
          v-for="video in videoList"
          :key="video.id"
          class="media-item"
          @click="playVideo(video)"
        >
          <image
            class="media-image"
            :src="video.cover"
            mode="aspectFill"
          ></image>
          <view class="play-overlay">
            <view class="play-button">
              <text class="play-icon">▶</text>
            </view>
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
import { imgBaseUrl } from "@/config/dev.env";
// 响应式数据
const activeTab = ref("photo");
const statusBarHeight = ref(44);
const safeAreaBottom = ref(34);
const contentInfo = ref<any>({});
const photoList = ref<any[]>([]);
const videoList = ref<any[]>([]);

//接口
// 获取消息详情
const getMessageDetail = async (id: string) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/my/notice/detail/${id}`,
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getMessageDetail ~ res:", res);
  if (res.data.code === 200) {
    contentInfo.value = res.data.data;
  }
};
// 初始化照片数据
const initPhotoList = () => {
  const imageUrls = [
    "/static/bg/home-bg.jpg",
    "/static/bg/profile-bg.jpg",
    "/static/challenges/great-wall.jpg",
    "/static/challenges/sahara.jpg",
    "/static/challenges/amazon.jpg",
    "/static/challenges/silk-road.jpg",
    "/static/maps/default-map.jpg",
  ];

  const photos = [];
  for (let i = 1; i <= 10; i++) {
    photos.push({
      id: i,
      url: imageUrls[(i - 1) % imageUrls.length],
      title: `照片${i}`,
      createTime: "2025.06.11 12:02",
    });
  }
  photoList.value = photos;
};

// 初始化视频数据
const initVideoList = () => {
  const imageUrls = [
    "/static/bg/home-bg.jpg",
    "/static/bg/profile-bg.jpg",
    "/static/challenges/great-wall.jpg",
    "/static/challenges/sahara.jpg",
    "/static/challenges/amazon.jpg",
    "/static/challenges/silk-road.jpg",
    "/static/maps/default-map.jpg",
  ];

  const videos = [];
  for (let i = 1; i <= 10; i++) {
    videos.push({
      id: i,
      cover: imageUrls[(i - 1) % imageUrls.length],
      url: "",
      title: `视频${i}`,
      duration: "00:30",
      createTime: "2025.06.11 12:02",
    });
  }
  videoList.value = videos;
};

// 方法
const goBack = () => {
  uni.navigateBack();
};

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const previewPhoto = (index: number) => {
  const urls = photoList.value.map((photo) => photo.url);
  uni.previewImage({
    current: index,
    urls: urls,
  });
};

const playVideo = (video: any) => {
  uni.showToast({
    title: `播放视频: ${video.title}`,
    icon: "none",
  });
};

// 获取系统信息
const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 34;
};

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  getSystemInfo();
  initPhotoList();
  initVideoList();
  console.log("内容详情页面加载完成");
  const id = currentPage.options.id;
  console.log("🚀 ~ onMounted ~ id:", id);
  if (id) {
    getMessageDetail(id);
  }
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f4f5f9;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  position: relative;
  width: 750rpx;
  height: 426rpx; /* 调整高度以适应图片 */
}

.navbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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

/* 内容区域 */
.content-section {
  background: #ffffff;
  position: relative;
  z-index: 3;
  min-height: calc(100vh - 468rpx);
  padding: 80rpx 32rpx 0 32rpx;
}

.content-header {
  margin-bottom: 48rpx;
}

.content-title {
  font-size: 40rpx;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 24rpx;
  text-align: center;
  display: block;
}

.content-description {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.85);
  line-height: normal;
  display: block;
}

/* Tab切换 */
.tab-section {
  margin-bottom: 24rpx;
}

.tabs {
  display: flex;
  width: 100%;
  height: 88rpx;
}

.tab-item {
  width: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-text {
  font-size: 32rpx;
  color: #86909c;
  padding: 16rpx 0;

  &.active {
    color: #1d2129;
    font-weight: 600;
  }
}

.tab-item.active .tab-text {
  color: #1d2129;
  font-weight: 600;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 4rpx;
  background: #fadb47;
}

/* 媒体网格 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding-bottom: 32rpx;
}

.media-item {
  position: relative;
  width: 100%;
  height: 240rpx;
  overflow: hidden;
}

.media-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 视频播放覆盖层 */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.play-button {
  width: 96rpx;
  height: 96rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  font-size: 32rpx;
  color: #1d2129;
  margin-left: 6rpx; /* 微调播放图标位置 */
}

/* 底部安全区域 */
.safe-area-bottom {
  width: 100%;
}
</style>
