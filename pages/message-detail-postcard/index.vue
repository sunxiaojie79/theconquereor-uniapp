<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <image class="navbar-bg" src="/static/bg/home-bg.jpg" mode="aspectFill"></image>
      <view class="navbar-content">
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
          <view class="navbar-left" @click="goBack">
            <image class="back-icon" src="/static/arrow-left.png" mode="aspectFill"></image>
          </view>
      </view>
    </view>
    <view class="content-section">
    <!-- 明信片 -->
    <view class="postcard-section">
          <!-- 左侧图片区域 -->
          <view class="postcard-left">
              <!-- <image class="city-image" src="/static/bg/home-bg.jpg" mode="aspectFill"></image> -->
              <!-- 城市名称 -->
              <view class="city-name-overlay">
                <text class="city-name">城市名称</text>
              </view>
              <!-- 底部信息 -->
              <view class="bottom-info">
                <view class="progress-info">
                  <text class="progress-text">完成：78.121</text>
                  <text class="progress-text">剩余：78.121</text>
                </view>
                <view class="avatar-container">
                  <image class="user-avatar" src="/static/avatars/friend1.png" mode="aspectFill"></image>
                </view>
              </view>
          </view>
          
          <!-- 右侧内容区域 -->
          <view class="postcard-right">
            <!-- 邮票区域 -->
            <view class="stamp-section">
              <view class="stamp-container">
                <image class="stamp-image" src="/static/challenges/great-wall.jpg" mode="aspectFill"></image>
                <!-- 邮戳 -->
                <view class="postmark-container">
                  <image class="postmark-bg" src="/static/postmark.png" mode="aspectFit"></image>
                  <view class="postmark-content">
                    <text class="postmark-date">12.30</text>
                    <text class="postmark-year">2025</text>
                  </view>
                </view>
              </view>
            </view>
            
            <!-- 右侧文字内容 -->
            <view class="right-text-content">
              <text class="greeting-text">你好，</text>
              <text class="main-text">{{ postcardText }}</text>
            </view>
          </view>
    </view>
    <!-- 内容区域 -->
    
      <view class="content-header">
        <text class="content-description">{{ contentInfo.description }}</text>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom" :style="{ height: safeAreaBottom + 'px' }"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const activeTab = ref('photo')
const statusBarHeight = ref(44)
const safeAreaBottom = ref(34)
const contentInfo = ref({
  title: '这是一个标题',
  description: '吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。'
})
const postcardText = ref('吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣！为善无近名，为恶无近刑。缘督以为经，可以保身，可以全生，可以养亲，可以尽年。')
const photoList = ref<any[]>([])
const videoList = ref<any[]>([])

// 初始化照片数据
const initPhotoList = () => {
  const imageUrls = [
    '/static/bg/home-bg.jpg',
    '/static/bg/profile-bg.jpg',
    '/static/challenges/great-wall.jpg',
    '/static/challenges/sahara.jpg',
    '/static/challenges/amazon.jpg',
    '/static/challenges/silk-road.jpg',
    '/static/maps/default-map.jpg'
  ]
  
  const photos = []
  for (let i = 1; i <= 10; i++) {
    photos.push({
      id: i,
      url: imageUrls[(i - 1) % imageUrls.length],
      title: `照片${i}`,
      createTime: '2025.06.11 12:02'
    })
  }
  photoList.value = photos
}

// 初始化视频数据
const initVideoList = () => {
  const imageUrls = [
    '/static/bg/home-bg.jpg',
    '/static/bg/profile-bg.jpg',
    '/static/challenges/great-wall.jpg',
    '/static/challenges/sahara.jpg',
    '/static/challenges/amazon.jpg',
    '/static/challenges/silk-road.jpg',
    '/static/maps/default-map.jpg'
  ]
  
  const videos = []
  for (let i = 1; i <= 10; i++) {
    videos.push({
      id: i,
      cover: imageUrls[(i - 1) % imageUrls.length],
      url: '',
      title: `视频${i}`,
      duration: '00:30',
      createTime: '2025.06.11 12:02'
    })
  }
  videoList.value = videos
}

// 方法
const goBack = () => {
  uni.navigateBack()
}

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const previewPhoto = (index: number) => {
  const urls = photoList.value.map(photo => photo.url)
  uni.previewImage({
    current: index,
    urls: urls
  })
}

const playVideo = (video: any) => {
  uni.showToast({
    title: `播放视频: ${video.title}`,
    icon: 'none'
  })
}

// 获取系统信息
const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 34
}

onMounted(() => {
  getSystemInfo()
  initPhotoList()
  initVideoList()
  console.log('内容详情页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #ffffff;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width:750rpx;
  height: 176rpx; /* 调整高度以适应图片 */
}

.navbar-bg {
  position: fixed;
  top: 0;
  left: 0;
  width:750rpx;
  height: 176rpx;
  z-index: 1;
}

.navbar-content {
  position: fixed;
  top: 0;
  left: 0;
  width:750rpx;
  height: 176rpx;
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
  top: 176rpx;
  min-height: calc(100vh - 176rpx - 34rpx);
  z-index: 3;
  padding: 32rpx ;
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
  line-height: 1.8;
  display: block;
  text-align: justify;
}


/* 底部安全区域 */
.safe-area-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

/* 明信片样式 */
.postcard-section {
  display: flex;
  height: 480rpx;
  background: #FDF7F1;
  border: 6rpx solid #DBCDBF;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-bottom: 64rpx;
  padding: 16rpx;
  box-sizing: border-box;
}

/* 左侧图片区域 */
.postcard-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 318rpx;
  height: 440rpx;
  background-image: url('/static/bg/home-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

.city-name-overlay {
  width: 100%;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.45);
  padding-left: 16rpx;
  line-height: 60rpx;
  box-sizing: border-box;
}

.city-name {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.bottom-info {
  width: 100%;
  height: 92rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 16rpx;
  box-sizing: border-box;
}

.progress-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.progress-text {
  display: block;
  color:rgba(255, 255, 255, 0.85);
  font-size: 24rpx;
  line-height: 1.3;
  font-weight: normal;
}

.avatar-container {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 2rpx solid #CDD5D7;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧内容区域 */
.postcard-right {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

/* 邮票区域 */
.stamp-section {
  margin-bottom: 32rpx;
  display: flex;
  justify-content: flex-end;
}

.stamp-container {
  position: relative;
  width: 120rpx;
  height: 80rpx;
}

.stamp-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4rpx;
  border: 2rpx solid #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.postmark-container {
  position: absolute;
  top: 0rpx;
  left: -45rpx;
  width: 65rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.postmark-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.8;
}

.postmark-content {
  position: relative;
  left: -5rpx;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-20deg);
}

.postmark-date {
  font-size: 16rpx;
  color: #3D3D3D;
  font-weight: 500;
  text-align: center;
  
}

.postmark-year {
  font-size: 12rpx;
  color: #3D3D3D;
  font-weight: 500;
  text-align: center;
}

/* 右侧文字内容 */
.right-text-content {
  flex: 1;
}

.greeting-text {
  display: block;
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16rpx;
}

.main-text {
  font-size: 24rpx;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.6;
  display: block;
}
</style> 