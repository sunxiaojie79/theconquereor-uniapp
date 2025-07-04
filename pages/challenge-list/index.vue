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
          <image
            class="dropdown-icon"
            src="/static/arrow-down.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view class="filter-right">
        <view class="filter-btn" @click="showFilterModal = true">
          <text class="filter-text">筛选</text>
          <image
            class="filter-icon"
            src="/static/equalizer.png"
            mode="aspectFill"
          ></image>
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
    <view
      v-if="showSortOptions"
      class="sort-modal-overlay"
      @click="showSortOptions = false"
    >
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
    <view
      v-if="showFilterModal"
      class="filter-modal-overlay"
      @click="showFilterModal = false"
    >
      <view class="filter-modal" @click.stop>
        <!-- 距离部分 -->
        <view class="filter-section">
          <text class="filter-section-title">距离</text>
          <view class="distance-options">
            <view
              v-for="option in distanceOptions"
              :key="option.value"
              class="distance-option"
              :class="{
                selected: selectedFilters.distance.includes(option.value),
              }"
              @click="selectDistance(option.value)"
            >
              <view
                class="distance-checkbox"
                :class="{
                  selected: selectedFilters.distance.includes(option.value),
                }"
              >
                <image
                  v-if="selectedFilters.distance.includes(option.value)"
                  class="checked-icon"
                  src="/static/checked.png"
                  mode="aspectFill"
                />
              </view>
              <text class="distance-text">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 挑战类型部分 -->
        <view class="filter-section">
          <text class="filter-section-title">挑战类型</text>
          <view class="radio-options">
            <view
              v-for="(type, index) in displayChallengeTypes"
              :key="type.value"
              class="radio-option"
              @click="toggleCheckbox('challengeType', type.value)"
            >
              <text class="option-text">{{ type.label }}</text>
              <image
                class="checkbox-icon"
                :src="
                  selectedFilters.challengeType.includes(type.value)
                    ? '/static/cell-on.png'
                    : '/static/cell-off.png'
                "
                mode="aspectFill"
              />
            </view>
          </view>
          <text class="expand-btn" @click="toggleExpand('challengeType')">
            {{ expandState.challengeType ? "收起" : "更多" }}
          </text>
        </view>

        <!-- 品牌授权合作部分 -->
        <view class="filter-section">
          <text class="filter-section-title">品牌授权合作</text>
          <view class="radio-options">
            <view
              v-for="(brand, index) in displayBrandPartners"
              :key="brand.value"
              class="radio-option"
              @click="toggleCheckbox('brandPartner', brand.value)"
            >
              <text class="option-text">{{ brand.label }}</text>
              <image
                class="checkbox-icon"
                :src="
                  selectedFilters.brandPartner.includes(brand.value)
                    ? '/static/cell-on.png'
                    : '/static/cell-off.png'
                "
                mode="aspectFill"
              />
            </view>
          </view>
          <text class="expand-btn" @click="toggleExpand('brandPartner')">
            {{ expandState.brandPartner ? "收起" : "更多" }}
          </text>
        </view>

        <!-- 过滤我已购买的挑战 -->
        <view class="filter-section">
          <view
            class="radio-option"
            style="border-radius: 8rpx; border: 0rpx"
            @click="toggleCheckbox('purchased', 'purchased')"
          >
            <text class="option-text">过滤我已购买的挑战</text>
            <image
              class="checkbox-icon"
              :src="
                selectedFilters.purchased
                  ? '/static/cell-on.png'
                  : '/static/cell-off.png'
              "
              mode="aspectFill"
            />
          </view>
        </view>

        <!-- 底部按钮 -->
        <view class="filter-actions">
          <button class="filter-cancel" @click="showFilterModal = false">
            取消
          </button>
          <button class="filter-confirm" @click="confirmFilters">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ChallengeCard from "@/components/challenge-card/index.vue";

// 响应式数据
const activeTab = ref("all");
const showSortOptions = ref(false);
const showFilterModal = ref(false);
const currentSort = ref("最新");

// 排序选项
const sortOptions = ref([
  { label: "最新", value: "newest" },
  { label: "最热", value: "hottest" },
  { label: "线路短到长", value: "distance_asc" },
  { label: "线路长到短", value: "distance_desc" },
]);

// 筛选相关数据
const distanceOptions = ref([
  { label: "短距离：<161km", value: "short" },
  { label: "中距离：161-1126km", value: "medium" },
  { label: "长距离：1127-2414km", value: "long" },
  { label: "超长距：<2414+km", value: "ultra" },
]);

const challengeTypes = ref([
  { label: "亚洲", value: "asia" },
  { label: "亚洲", value: "asia2" },
  { label: "亚洲", value: "asia3" },
  { label: "亚洲", value: "asia4" },
  { label: "欧洲", value: "europe" },
  { label: "非洲", value: "africa" },
  { label: "美洲", value: "america" },
]);

const brandPartners = ref([
  { label: "李宁", value: "lining" },
  { label: "耐克", value: "nike" },
  { label: "阿迪达斯", value: "adidas" },
  { label: "安踏", value: "anta" },
  { label: "匹克", value: "peak" },
  { label: "特步", value: "xtep" },
]);

const expandState = ref({
  challengeType: false,
  brandPartner: false,
});

const selectedFilters = ref({
  distance: [] as string[], // 改为多选
  challengeType: [] as string[], // 改为多选
  brandPartner: [] as string[], // 改为多选
  purchased: false,
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
    createTime: "2024-01-15",
  },
  {
    id: 2,
    title: "撒哈拉沙漠探索",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: true,
    difficulty: "困难",
    category: "自然",
    createTime: "2024-01-10",
  },
  {
    id: 3,
    title: "亚马逊雨林冒险",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: false,
    difficulty: "极限",
    category: "自然",
    createTime: "2024-01-08",
  },
  {
    id: 4,
    title: "丝绸之路重走",
    description: "副标题副标题",
    image: "/static/challenges/silk-road.jpg",
    isLiked: false,
    difficulty: "中等",
    category: "历史",
    createTime: "2024-01-05",
  },
  {
    id: 5,
    title: "喜马拉雅山脉挑战",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/great-wall.jpg",
    isLiked: true,
    difficulty: "极限",
    category: "自然",
    createTime: "2024-01-03",
  },
  {
    id: 6,
    title: "北极圈极地探险",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: false,
    difficulty: "困难",
    category: "自然",
    createTime: "2024-01-01",
  },
  {
    id: 7,
    title: "马拉松环球挑战",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: true,
    difficulty: "简单",
    category: "运动",
    createTime: "2023-12-28",
  },
  {
    id: 8,
    title: "古代商路探索",
    description: "副标题副标题",
    image: "/static/challenges/silk-road.jpg",
    isLiked: false,
    difficulty: "中等",
    category: "历史",
    createTime: "2023-12-25",
  },
  {
    id: 9,
    title: "热带雨林穿越",
    description: "副标题副标题支撑最多两行显示",
    image: "/static/challenges/amazon.jpg",
    isLiked: false,
    difficulty: "困难",
    category: "自然",
    createTime: "2023-12-20",
  },
  {
    id: 10,
    title: "沙漠生存挑战",
    description: "副标题副标题",
    image: "/static/challenges/sahara.jpg",
    isLiked: true,
    difficulty: "极限",
    category: "生存",
    createTime: "2023-12-15",
  },
]);

// 收藏的挑战
const favoriteChallenges = computed(() => {
  return allChallenges.value.filter((challenge) => challenge.isLiked);
});

// 显示的挑战列表
const displayChallenges = computed(() => {
  return activeTab.value === "all"
    ? allChallenges.value
    : favoriteChallenges.value;
});

// 显示的挑战类型（支持展开收起）
const displayChallengeTypes = computed(() => {
  return expandState.value.challengeType
    ? challengeTypes.value
    : challengeTypes.value.slice(0, 4);
});

// 显示的品牌合作伙伴（支持展开收起）
const displayBrandPartners = computed(() => {
  return expandState.value.brandPartner
    ? brandPartners.value
    : brandPartners.value.slice(0, 3);
});

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

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const selectSort = (option: any) => {
  currentSort.value = option.label;
  showSortOptions.value = false;
  // TODO: 实现排序逻辑
};

// 选择距离（多选）
const selectDistance = (value: string) => {
  const index = selectedFilters.value.distance.indexOf(value);
  if (index > -1) {
    selectedFilters.value.distance.splice(index, 1);
  } else {
    selectedFilters.value.distance.push(value);
  }
};

// 切换展开状态
const toggleExpand = (type: string) => {
  if (type === "challengeType") {
    expandState.value.challengeType = !expandState.value.challengeType;
  } else if (type === "brandPartner") {
    expandState.value.brandPartner = !expandState.value.brandPartner;
  }
};

// 切换多选框
const toggleCheckbox = (type: string, value: string) => {
  if (type === "challengeType") {
    const index = selectedFilters.value.challengeType.indexOf(value);
    if (index > -1) {
      selectedFilters.value.challengeType.splice(index, 1);
    } else {
      selectedFilters.value.challengeType.push(value);
    }
  } else if (type === "brandPartner") {
    const index = selectedFilters.value.brandPartner.indexOf(value);
    if (index > -1) {
      selectedFilters.value.brandPartner.splice(index, 1);
    } else {
      selectedFilters.value.brandPartner.push(value);
    }
  } else if (type === "purchased") {
    selectedFilters.value.purchased = !selectedFilters.value.purchased;
  }
};

// 重置筛选
const resetFilters = () => {
  selectedFilters.value.distance = [];
  selectedFilters.value.challengeType = [];
  selectedFilters.value.brandPartner = [];
  selectedFilters.value.purchased = false;
};

// 确认筛选
const confirmFilters = () => {
  showFilterModal.value = false;
  // TODO: 实现筛选逻辑
  console.log("应用筛选条件:", selectedFilters.value);
};

const handleLikeChallenge = (challengeId: number) => {
  const challenge = allChallenges.value.find((c) => c.id === challengeId);
  if (challenge) {
    challenge.isLiked = !challenge.isLiked;
  }
};

const handleJoinChallenge = (challengeId: number) => {
  uni.navigateTo({
    url: `/pages/challenge-square/index?projectId=${challengeId}`,
  });
};

const handleChallengeClick = (challengeId: number) => {
  uni.navigateTo({
    url: `/pages/route-detail/index?id=${challengeId}`,
  });
};

onMounted(() => {
  console.log("全部挑战页面加载完成");
  console.log("挑战总数:", allChallenges.value.length);
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242a36;
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
      color: #ffd700;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #ffd700;
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
  color: #fff;
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
  color: #fff;
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
  background: #f4f5f9;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  animation: slideUp 0.3s ease-out;
}

.sort-options-container {
  background: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  overflow: hidden;
}

.sort-option {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
  text-align: center;

  &:last-child {
    border-bottom: none;
  }

  &.selected {
    background: #fff;

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
  background: #fff;
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
  align-items: flex-end;
  justify-content: center;
}

.filter-modal {
  background: #f4f5f9;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.3s ease-out;
}

.filter-section {
  padding: 48rpx 32rpx 0 32rpx;

  &:last-of-type {
    padding-bottom: 20rpx;
  }
}

.filter-section-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
  margin-bottom: 24rpx;
  display: block;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

/* 距离选项 - 多选 */
.distance-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.distance-option {
  width: 335rpx;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  flex-grow: 1;
  box-sizing: border-box;
  /* 4px */
  border-radius: 8rpx;
  background: #ffffff;
  border: 2rpx solid transparent;
  cursor: pointer;
  position: relative;

  &.selected {
    border: 2rpx solid #242a36;
  }
}

.distance-checkbox {
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  width: 40rpx;
  height: 40rpx;
}

.checked-icon {
  width: 100%;
  height: 100%;
}

.distance-text {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.85);
  flex: 1;
}

/* 多选框选项 */
.radio-options {
  width: 686rpx;
  display: flex;
  flex-direction: column;
  border-radius: 8rpx 8rpx 0rpx 0rpx;
  background: #ffffff;
}

.radio-option {
  width: 686rpx;
  height: 112rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 32rpx;
  background: #ffffff;
  border-width: 0rpx 0rpx 1rpx 0rpx;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.09);
}

.checkbox-icon {
  /* 自动布局子元素 */
  width: 48rpx;
  height: 48rpx;
}

.option-text {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
}

.expand-btn {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  width: 686rpx;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 20rpx 32rpx;
  border-radius: 0px 0px 4px 4px;
  background: #ffffff;
}

/* 底部按钮 */
.filter-actions {
  display: flex;
  gap: 20rpx;
  padding: 40rpx;
  margin-top: 20rpx;
}

.filter-cancel,
.filter-confirm {
  height: 80rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 34rpx;
  font-weight: normal;
}

.filter-cancel {
  width: 278rpx;
  background: #fff;
  color: #242a36;
  border: 2rpx solid rgba(0, 0, 0, 0.45);
}

.filter-confirm {
  width: 392rpx;
  background: #fadb47;
  color: #242a36;
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
