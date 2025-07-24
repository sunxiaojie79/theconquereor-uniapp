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
          <image
            class="media-image"
            :src="imgBaseUrl + photo.url"
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 视频列表 -->
      <view v-if="activeTab === 'video'" class="media-grid">
        <view
          v-for="(video, index) in videoList"
          :key="video.id"
          class="media-item"
          @click="playVideo(index)"
        >
          <image
            class="media-image"
            :src="imgBaseUrl + video.url"
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
    <view v-if="showVideo" class="video-container">
      <view class="video-close" @click="showVideo = false">
        <icon type="cancel" size="40" color="#fff"></icon>
      </view>
      <video
        id="myVideo"
        class="video-content"
        :src="currentVideoUrl"
        controls
        object-fit="cover"
      ></video>
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
const currentVideoUrl = ref<string>("");
const showVideo = ref<boolean>(false);
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
    initPhotoList();
  }
};
// 初始化照片数据
const initPhotoList = () => {
  const photos = [];
  const imageUrls = [];
  for (
    let i = 0;
    i < contentInfo.value.appScenicSpot.resourceList.length;
    i++
  ) {
    const resource = contentInfo.value.appScenicSpot.resourceList[i];
    if (resource.resourceType === "0") {
      photos.push({
        id: i,
        url: contentInfo.value.appScenicSpot.resourceList[i].path,
        title: `照片${i}`,
      });
    } else if (resource.resourceType === "1") {
      imageUrls.push({
        id: i,
        url: contentInfo.value.appScenicSpot.resourceList[i].path,
        title: `视频${i}`,
      });
    }
  }
  console.log("🚀 ~ initPhotoList ~ photos:", photos);
  console.log("🚀 ~ initPhotoList ~ imageUrls:", imageUrls);
  photoList.value = photos;
  videoList.value = imageUrls;
};

// 方法
const goBack = () => {
  uni.navigateBack();
};

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const previewPhoto = (index: number) => {
  const urls = photoList.value.map((photo) => imgBaseUrl + photo.url);
  uni.previewImage({
    current: index,
    urls: urls,
  });
};

const playVideo = (index: number) => {
  currentVideoUrl.value = imgBaseUrl + videoList.value[index].url;
  console.log("🚀 ~ playVideo ~ currentVideoUrl:", currentVideoUrl.value);
  showVideo.value = true;
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
.video-container {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.video-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-close {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  z-index: 1001;
}
</style>
