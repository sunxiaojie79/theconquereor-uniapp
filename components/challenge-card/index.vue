<template>
  <view 
    class="project-card"
    @click="handleCardClick"
  >
    <view class="card-header">
      <image
        class="project-image"
        :src="project.image"
        mode="aspectFill"
      ></image>
      <view
        class="like-btn"
        :class="{ liked: project.isLiked }"
        @click.stop="handleLikeClick"
      >
        <image
          v-if="project.isLiked"
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
      <text class="project-title">{{ project.title }}</text>
      <text class="project-desc">{{ project.description }}</text>
      <button
        class="join-btn"
        @click.stop="handleJoinClick"
      >
        加入挑战
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  image: string
  isLiked: boolean
}

interface Props {
  project: Project
}

interface Emits {
  (e: 'like', projectId: number): void
  (e: 'join', projectId: number): void
  (e: 'click', projectId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleLikeClick = () => {
  emit('like', props.project.id)
}

const handleJoinClick = () => {
  emit('join', props.project.id)
}

const handleCardClick = () => {
  emit('click', props.project.id)
}
</script>

<style lang="scss" scoped>
.project-card {
  background: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  width: 331rpx;
  height: 472rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rpx 0rpx 24rpx 0rpx;
  flex-grow: 1;
  z-index: 0;
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
  color: rgba(0, 0, 0, 0.85);
  font-size: 34rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
}

.project-desc {
  color: rgba(0, 0, 0, 0.65);
  font-size: 28rpx;
  line-height: 1.4;
  margin-bottom: 25rpx;
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
  font-size: 34rpx;
  font-weight: 500;
  color: #fff;
  background: #242a36;
  border: none;
  border-radius: 8rpx;
}
</style> 