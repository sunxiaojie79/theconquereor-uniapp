<template>
  <view class="project-card-container">
    <image
      class="project-image-cover"
      :src="project.productCover"
      mode="aspectFit"
    ></image>
    <view class="project-card" @click.stop="handleJoinClick">
      <view class="card-header">
        <image
          class="project-image"
          :src="project.backgroundImgUrl"
          mode="aspectFill"
        ></image>
        <view
          class="like-btn"
          :class="{ liked: project.collectFlag }"
          @click.stop="handleLikeClick"
        >
          <image
            v-if="project.collectFlag"
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
      <view class="card-content">
        <text class="project-title">{{ project.challengeTitle }}</text>
        <text class="project-desc">{{ project.subtitle }}</text>
        <button class="join-btn">加入挑战</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface Project {
  id: number;
  challengeTitle: string;
  subtitle: string;
  productDescription: string;
  productCover: string;
  collectFlag: boolean;
  backgroundImgUrl: string;
}

interface Props {
  project: Project;
}

interface Emits {
  (e: "like", project: Project): void;
  (e: "join", projectId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleLikeClick = () => {
  emit("like", props.project);
};

const handleJoinClick = () => {
  emit("join", props.project.id);
};
</script>

<style lang="scss" scoped>
.project-card-container {
  position: relative;
  width: 331rpx;
  height: 496rpx;
}
.project-image-cover {
  position: absolute;
  top: 12rpx;
  left: 46rpx;
  width: 240rpx;
  height: 240rpx;
  object-fit: contain;
  z-index: 99;
}
.project-card {
  position: absolute;
  top: 48rpx;
  left: 0;
  background: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  width: 331rpx;
  height: 448rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 0rpx 0rpx 24rpx 0rpx;
  flex-grow: 1;
  box-sizing: border-box;
}

.card-header {
  width: 331rpx;
  height: 208rpx;
  position: relative;
}

.project-image {
  width: 100%;
  height: 100%;
}

.like-btn {
  position: absolute;
  z-index: 999;
  top: 20rpx;
  left: 20rpx;
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

.card-content {
  width: 331rpx;
  height: 240rpx;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 0rpx 16rpx;
  align-self: stretch;
}

.project-title {
  height: 40rpx;
  color: rgba(0, 0, 0, 0.85);
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
  margin-top: 14rpx;
}

.project-desc {
  height: 80rpx;
  color: rgba(0, 0, 0, 0.65);
  font-size: 28rpx;
  line-height: 1.4;
  margin-bottom: 6rpx;
  height: 80rpx;
  display: block;
  text-align: center;
}

.join-btn {
  width: 299rpx;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  gap: 20rpx;
  align-self: stretch;
  z-index: 1;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  background: #242a36;
  border: none;
  border-radius: 8rpx;
}
</style>
