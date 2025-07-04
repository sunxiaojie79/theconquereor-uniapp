<template>
  <view class="page">

    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tabs">
        <view 
          class="tab-item"
          :class="{ active: activeTab === 'all' }"
          @click="switchTab('all')"
        >
          <text class="tab-text">全部</text>
        </view>
        <view 
          class="tab-item"
          :class="{ active: activeTab === 'favorite' }"
          @click="switchTab('favorite')"
        >
          <text class="tab-text">我的收藏</text>
        </view>
      </view>
    </view>

    <!-- 筛选工具栏 -->
    <view class="filter-toolbar">
      <view class="filter-left">
        <view class="sort-dropdown" @click="showSortOptions = !showSortOptions">
          <text class="sort-text">{{ currentSort }}</text>
          <image class="dropdown-icon" src="/static/arrow-down.png" mode="aspectFill"></image>
        </view>
      </view>
      <view class="filter-right">
        <view class="filter-btn" @click="showFilterModal = true">
          <text class="filter-text">筛选</text>
          <image class="filter-icon" src="/static/equalizer.png" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 挑战列表 -->
    <view class="challenge-list">
      <view class="challenges-grid">
        <ChallengeCard
          v-for="challenge in displayChallenges"
          :key="challenge.id"
          :project="challenge"
          @like="handleLikeChallenge"
          @join="handleJoinChallenge"
          @click="handleChallengeClick"
        />
      </view>
    </view>

    <!-- 排序选项弹框 -->
    <view v-if="showSortOptions" class="sort-modal-overlay" @click="showSortOptions = false">
      <view class="sort-modal" @click.stop>
        <view class="sort-options-container">
          <view 
            v-for="option in sortOptions"
            :key="option.value"
            class="sort-option"
            :class="{ selected: currentSort === option.label }"
            @click="selectSort(option)"
          >
            <text class="sort-option-text">{{ option.label }}</text>
          </view>
        </view>
        <view class="sort-cancel-container">
          <view class="sort-cancel" @click="showSortOptions = false">
            <text class="sort-cancel-text">取消</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 筛选弹框 -->
    <view v-if="showFilterModal" class="filter-modal-overlay" @click="showFilterModal = false">
      <view class="filter-modal" @click.stop>
        <view class="filter-header">
          <text class="filter-title">筛选</text>
          <text class="filter-close" @click="showFilterModal = false">✕</text>
        </view>
        <view class="filter-content">
          <text class="filter-section-title">难度等级</text>
          <view class="filter-options">
            <view 
              v-for="level in difficultyLevels"
              :key="level"
              class="filter-chip"
              :class="{ selected: selectedFilters.difficulty.includes(level) }"
              @click="toggleFilter('difficulty', level)"
            >
              <text class="filter-chip-text">{{ level }}</text>
            </view>
          </view>
        </view>
        <view class="filter-actions">
          <button class="filter-reset" @click="resetFilters">重置</button>
          <button class="filter-apply" @click="applyFilters">应用</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ChallengeCard from "@/components/challenge-card/index.vue";

// 响应式数据
const activeTab = ref('all');
const showSortOptions = ref(false);
const showFilterModal = ref(false);
const currentSort = ref('最新');

// 排序选项
const sortOptions = ref([
  { label: '最新', value: 'newest' },
  { label: '最热', value: 'hottest' },
  { label: '线路短到长', value: 'distance_asc' },
  { label: '线路长到短', value: 'distance_desc' }
]);

// 筛选相关
const difficultyLevels = ref(['简单', '中等', '困难', '极限']);
const selectedFilters = ref({
  difficulty: [] as string[]
});

// Mock 10条挑战数据
const allChallenges = ref([
  {
    id: 1,
    title: "万里长城征途",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/great-wall.jpg",
    isLiked: false,
    difficulty: "中等",
    category: "历史",
    createTime: "2024-01-15"
  },
  {
    id: 2,
    title: "撒哈拉沙漠探索",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: true,
    difficulty: "困难",
    category: "自然",
    createTime: "2024-01-10"
  },
  {
    id: 3,
    title: "亚马逊雨林冒险",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: false,
    difficulty: "极限",
    category: "自然",
    createTime: "2024-01-08"
  },
  {
    id: 4,
    title: "丝绸之路重走",
    description: "副标题副标题",
    image: "/static/challenges/silk-road.jpg",
    isLiked: false,
    difficulty: "中等",
    category: "历史",
    createTime: "2024-01-05"
  },
  {
    id: 5,
    title: "喜马拉雅山脉挑战",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/great-wall.jpg",
    isLiked: true,
    difficulty: "极限",
    category: "自然",
    createTime: "2024-01-03"
  },
  {
    id: 6,
    title: "北极圈极地探险",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: false,
    difficulty: "困难",
    category: "自然",
    createTime: "2024-01-01"
  },
  {
    id: 7,
    title: "马拉松环球挑战",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: true,
    difficulty: "简单",
    category: "运动",
    createTime: "2023-12-28"
  },
  {
    id: 8,
    title: "古代商路探索",
    description: "副标题副标题",
    image: "/static/challenges/silk-road.jpg",
    isLiked: false,
    difficulty: "中等",
    category: "历史",
    createTime: "2023-12-25"
  },
  {
    id: 9,
    title: "热带雨林穿越",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: false,
    difficulty: "困难",
    category: "自然",
    createTime: "2023-12-20"
  },
  {
    id: 10,
    title: "沙漠生存挑战",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: true,
    difficulty: "极限",
    category: "生存",
    createTime: "2023-12-15"
  }
]);

// 收藏的挑战
const favoriteChallenges = computed(() => {
  return allChallenges.value.filter(challenge => challenge.isLiked);
});

// 显示的挑战列表
const displayChallenges = computed(() => {
  return activeTab.value === 'all' ? allChallenges.value : favoriteChallenges.value;
});

// 方法
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({
      fail: () => {
        uni.switchTab({ url: '/pages/index/index' });
      }
    });
  } else {
    uni.switchTab({ url: '/pages/index/index' });
  }
};

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const selectSort = (option: any) => {
  currentSort.value = option.label;
  showSortOptions.value = false;
  // TODO: 实现排序逻辑
};

const toggleFilter = (type: string, value: string) => {
  if (type === 'difficulty') {
    const index = selectedFilters.value.difficulty.indexOf(value);
    if (index > -1) {
      selectedFilters.value.difficulty.splice(index, 1);
    } else {
      selectedFilters.value.difficulty.push(value);
    }
  }
};

const resetFilters = () => {
  selectedFilters.value.difficulty = [];
};

const applyFilters = () => {
  showFilterModal.value = false;
  // TODO: 实现筛选逻辑
};

const handleLikeChallenge = (challengeId: number) => {
  const challenge = allChallenges.value.find(c => c.id === challengeId);
  if (challenge) {
    challenge.isLiked = !challenge.isLiked;
  }
};

const handleJoinChallenge = (challengeId: number) => {
  uni.navigateTo({
    url: `/pages/challenge-square/index?projectId=${challengeId}`
  });
};

const handleChallengeClick = (challengeId: number) => {
  uni.navigateTo({
    url: `/pages/route-detail/index?id=${challengeId}`
  });
};

onMounted(() => {
  console.log('全部挑战页面加载完成');
  console.log('挑战总数:', allChallenges.value.length);
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242A36;
  min-height: 100vh;
  color: #ffffff;
}


/* Tab切换 */
.tab-section {
  padding: 40rpx 30rpx 0 30rpx;
}

.tabs {
  display: flex;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 24rpx;
  position: relative;
  
  &.active {
    .tab-text {
      color: #FFD700;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #FFD700;
    }
  }
}

.tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #999;
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.sort-text {
  font-size: 28rpx;
  color: #FFF;
}

.dropdown-icon {
  width: 32rpx;
  height: 32rpx;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.filter-icon {
  width: 32rpx;
  height: 32rpx;
}

.filter-text {
  font-size: 28rpx;
  color: #FFF;
}

/* 挑战列表 */
.challenge-list {
  padding: 0 32rpx 100rpx 32rpx;
}

.challenges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

/* 排序弹框 */
.sort-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0;
}

.sort-modal {
  width: 100%;
  background: #F4F5F9;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  animation: slideUp 0.3s ease-out;
}

.sort-options-container {
  background: #FFF;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  overflow: hidden;
}

.sort-option {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #E5E5E5;
  text-align: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.selected {
    background: #FFF;
    
    .sort-option-text {
      color: #000;
      font-weight: 600;
    }
  }
}

.sort-option-text {
  font-size: 32rpx;
  color: #000;
}

.sort-cancel-container {
  background: #FFF;
  overflow: hidden;
}

.sort-cancel {
  padding: 40rpx 30rpx;
  text-align: center;
}

.sort-cancel-text {
  font-size: 32rpx;
  color: #000;
  font-weight: 500;
}

/* 筛选弹框 */
.filter-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-modal {
  background: #2A2D36;
  border-radius: 16rpx;
  width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #333;
}

.filter-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFF;
}

.filter-close {
  font-size: 32rpx;
  color: #999;
}

.filter-content {
  padding: 30rpx;
}

.filter-section-title {
  font-size: 28rpx;
  color: #FFF;
  margin-bottom: 20rpx;
  display: block;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.filter-chip {
  padding: 16rpx 24rpx;
  background: #333;
  border-radius: 20rpx;
  
  &.selected {
    background: #FFD700;
    
    .filter-chip-text {
      color: #333;
    }
  }
}

.filter-chip-text {
  font-size: 24rpx;
  color: #FFF;
}

.filter-actions {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #333;
}

.filter-reset, .filter-apply {
  flex: 1;
  height: 80rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.filter-reset {
  background: #333;
  color: #FFF;
}

.filter-apply {
  background: #FFD700;
  color: #333;
}

/* 动画效果 */
@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 