<template>
  <view class="page">
    <!-- 搜索和筛选栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input 
          type="text" 
          placeholder="搜索挑战路线" 
          v-model="searchKeyword"
          @input="handleSearch"
        />
      </view>
      <view class="filter-btn" @click="showFilter = true">
        <text class="filter-icon">🔽</text>
      </view>
    </view>

    <!-- 热门挑战轮播 -->
    <view class="hot-challenges">
      <swiper 
        class="swiper-container" 
        indicator-dots="true" 
        autoplay="true" 
        interval="3000"
        duration="500"
      >
        <swiper-item v-for="challenge in popularChallenges" :key="challenge.id">
          <view class="hot-challenge-card" @click="navigateToDetail(challenge.id)">
            <image :src="challenge.image" mode="aspectFill" class="hot-challenge-image"></image>
            <view class="hot-challenge-overlay">
              <view class="hot-badge">热门</view>
              <view class="hot-challenge-info">
                <text class="hot-challenge-name">{{ challenge.name }}</text>
                <text class="hot-challenge-desc">{{ challenge.totalDistance }}公里 · 难度: {{ getDifficultyText(challenge.difficulty) }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 挑战列表 -->
    <view class="challenge-list">
      <view 
        v-for="challenge in filteredChallenges" 
        :key="challenge.id"
        class="challenge-item"
        @click="navigateToDetail(challenge.id)"
      >
        <image :src="challenge.image" mode="aspectFill" class="challenge-image"></image>
        <view class="challenge-info">
          <view class="challenge-header">
            <text class="challenge-name">{{ challenge.name }}</text>
            <view class="challenge-theme">{{ challenge.theme }}</view>
          </view>
          <view class="challenge-stats">
            <text class="stat-item">📍 {{ challenge.totalDistance }}公里</text>
            <text class="stat-item">👥 {{ challenge.participants }}人正在挑战</text>
          </view>
          <view class="challenge-rating">
            <view class="stars">
              <text 
                v-for="i in 5" 
                :key="i"
                class="star"
                :class="{ active: i <= Math.floor(challenge.rating) }"
              >⭐</text>
            </view>
            <text class="rating-text">{{ challenge.rating }} ({{ challenge.reviews }}评价)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilter" class="filter-overlay" @click="showFilter = false">
      <view class="filter-popup" @click.stop>
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="filter-close" @click="showFilter = false">✕</text>
        </view>
        <view class="filter-content">
          <view class="filter-section">
            <text class="filter-label">难度</text>
            <view class="filter-options">
              <view 
                v-for="difficulty in difficulties"
                :key="difficulty.value"
                class="filter-option"
                :class="{ active: selectedDifficulty === difficulty.value }"
                @click="selectDifficulty(difficulty.value)"
              >
                {{ difficulty.label }}
              </view>
            </view>
          </view>
          <view class="filter-section">
            <text class="filter-label">主题</text>
            <view class="filter-options">
              <view 
                v-for="theme in themes"
                :key="theme"
                class="filter-option"
                :class="{ active: selectedTheme === theme }"
                @click="selectTheme(theme)"
              >
                {{ theme }}
              </view>
            </view>
          </view>
        </view>
        <view class="filter-actions">
          <button class="filter-reset" @click="resetFilter">重置</button>
          <button class="filter-confirm" @click="applyFilter">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChallengeStore } from '@/stores'

const challengeStore = useChallengeStore()

// 响应式数据
const searchKeyword = ref('')
const showFilter = ref(false)
const selectedDifficulty = ref('')
const selectedTheme = ref('')

// 筛选选项
const difficulties = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
]

const themes = ['历史主题', '自然探索', '亲子友好', '城市探索']

// 计算属性
const challenges = computed(() => challengeStore.challenges)
const popularChallenges = computed(() => challengeStore.popularChallenges)

const filteredChallenges = computed(() => {
  let result = challenges.value

  // 搜索过滤
  if (searchKeyword.value) {
    result = challengeStore.searchChallenges(searchKeyword.value)
  }

  // 筛选过滤
  if (selectedDifficulty.value || selectedTheme.value) {
    result = challengeStore.filterChallenges(
      selectedTheme.value || undefined,
      selectedDifficulty.value || undefined
    )
  }

  return result
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

const navigateToDetail = (challengeId: string) => {
  uni.navigateTo({ url: `/pages/route-detail/index?id=${challengeId}` })
}

const getDifficultyText = (difficulty: string) => {
  const difficultyMap = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return difficultyMap[difficulty] || '未知'
}

const selectDifficulty = (difficulty: string) => {
  selectedDifficulty.value = selectedDifficulty.value === difficulty ? '' : difficulty
}

const selectTheme = (theme: string) => {
  selectedTheme.value = selectedTheme.value === theme ? '' : theme
}

const resetFilter = () => {
  selectedDifficulty.value = ''
  selectedTheme.value = ''
}

const applyFilter = () => {
  showFilter.value = false
}

onMounted(() => {
  console.log('挑战广场页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: white;
  border-bottom: 1rpx solid #E5E6EB;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #F2F3F5;
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  
  .search-icon {
    font-size: 32rpx;
    color: #86909C;
    margin-right: 20rpx;
  }
  
  input {
    flex: 1;
    font-size: 28rpx;
    color: #1D2129;
    
    &::placeholder {
      color: #86909C;
    }
  }
}

.filter-btn {
  width: 80rpx;
  height: 80rpx;
  background: #F2F3F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .filter-icon {
    font-size: 28rpx;
    color: #86909C;
  }
}

.hot-challenges {
  margin: 20rpx;
}

.swiper-container {
  height: 320rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.hot-challenge-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hot-challenge-image {
  width: 100%;
  height: 100%;
}

.hot-challenge-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30rpx;
}

.hot-badge {
  align-self: flex-start;
  background: #FF7D00;
  color: white;
  padding: 8rpx 20rpx;
  border-radius: 50rpx;
  font-size: 24rpx;
}

.hot-challenge-info {
  .hot-challenge-name {
    color: white;
    font-size: 36rpx;
    font-weight: 600;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .hot-challenge-desc {
    color: rgba(255, 255, 255, 0.8);
    font-size: 28rpx;
    display: block;
  }
}

.challenge-list {
  padding: 0 20rpx;
}

.challenge-item {
  display: flex;
  background: white;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.challenge-image {
  width: 192rpx;
  height: 192rpx;
  flex-shrink: 0;
}

.challenge-info {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.challenge-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
  flex: 1;
}

.challenge-theme {
  background: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  margin-left: 16rpx;
}

.challenge-stats {
  margin-bottom: 16rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #86909C;
  margin-right: 30rpx;
}

.challenge-rating {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.stars {
  display: flex;
  gap: 4rpx;
}

.star {
  font-size: 24rpx;
  color: #E5E6EB;
  
  &.active {
    color: #FFB800;
  }
}

.rating-text {
  font-size: 24rpx;
  color: #86909C;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.filter-popup {
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #E5E6EB;
}

.filter-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
}

.filter-close {
  font-size: 40rpx;
  color: #86909C;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-content {
  padding: 30rpx;
}

.filter-section {
  margin-bottom: 40rpx;
}

.filter-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 20rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-option {
  padding: 16rpx 32rpx;
  background: #F2F3F5;
  border-radius: 50rpx;
  font-size: 24rpx;
  color: #86909C;
  transition: all 0.3s ease;
  
  &.active {
    background: #165DFF;
    color: white;
  }
}

.filter-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #E5E6EB;
}

.filter-reset {
  flex: 1;
  background: #F2F3F5;
  color: #86909C;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 28rpx;
}

.filter-confirm {
  flex: 1;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
}
</style> 