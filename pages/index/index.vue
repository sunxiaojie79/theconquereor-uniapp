<template>
  <view class="page">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <input
          class="item-input"
          placeholder="挑战项目"
          placeholder-style="color: #999;"
        />
      </view>
    </view>

    <!-- 挑战口令输入区域 -->
    <view class="challenge-code-section">
      <text class="section-title">输入您的挑战口令</text>
      <view class="input-area">
        <input
          class="code-input"
          placeholder="填写您的挑战口令"
          placeholder-style="color: #999;"
          v-model="challengeCode"
        />
        <view class="submit-btn" @click="submitChallengeCode">
          <text class="arrow">→</text>
        </view>
      </view>
    </view>

    <!-- 我的挑战 -->
    <view class="my-challenges">
      <view class="section-header">
        <text class="section-title">我的挑战</text>
        <image
          class="more-icon"
          src="/static/arrow-right.png"
          mode="aspectFill"
        ></image>
      </view>
      <scroll-view
        class="challenge-scroll"
        scroll-x="true"
        show-scrollbar="false"
      >
        <view
          v-for="challenge in myChallenges"
          :key="challenge.id"
          class="challenge-item"
          @click="navigateTo(`/pages/route-detail/index?id=${challenge.id}`)"
        >
          <image
            class="challenge-avatar"
            :src="challenge.avatar"
            mode="aspectFill"
          ></image>
          <view class="challenge-info">
            <text class="challenge-title">{{ challenge.title }}</text>
            <view class="challenge-stats">
              <image
                class="distance-icon"
                src="/static/distance.png"
                mode="aspectFill"
              ></image>
              <view>
                <text class="distance">{{ challenge.distance }}</text>
                <text class="distance-unit">km</text>
              </view>
              <view>
                <text class="progress">{{ challenge.progress }} </text>
                <text class="progress-unit">%</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 挑战项目 -->
    <view class="challenge-projects">
      <view class="section-header">
        <text class="section-title">挑战项目</text>
        <image
          class="more-icon"
          src="/static/arrow-right.png"
          mode="aspectFill"
        ></image>
      </view>
      <view class="projects-grid">
        <ChallengeCard
          v-for="project in challengeProjects"
          :key="project.id"
          :project="project"
          @like="handleLikeProject"
          @join="handleJoinProject"
          @click="handleCardClick"
        />
      </view>

      <button class="view-all-btn" @click="navigateTo('/pages/challenge-list/index')">查看全部挑战项目</button>
    </view>

    <!-- 常见问题解答 -->
    <view class="faq-section">
      <view class="section-header">
        <text class="section-title">常见问题解答</text>
        <image
          class="more-icon"
          src="/static/arrow-right.png"
          mode="aspectFill"
          @click="navigateTo('/pages/faq-list/index')"
        ></image>
      </view>
      <view class="faq-list">
        <view
          v-for="faq in faqList"
          :key="faq.id"
          class="faq-item"
          @click="handleFaqClick(faq.id)"
        >
          <text class="faq-question">{{ faq.question }}</text>
          <image
            class="more-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
    </view>
  </view>

  <!-- 弹框提示 -->
  <view v-if="showToast" class="toast-overlay" @click="showToast = false">
    <view class="toast-container" @click.stop>
      <view class="toast-content">
        <image
          class="toast-icon"
          :src="
            toastType === 'success' ? '/static/done.png' : '/static/error.png'
          "
          mode="aspectFit"
        />
        <text class="toast-text">{{
          toastType === "success" ? "绑定成功" : "绑定失败"
        }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore, useChallengeStore } from "@/stores";
import ChallengeCard from "@/components/challenge-card/index.vue";

const userStore = useUserStore();
const challengeStore = useChallengeStore();

// 挑战口令相关
const challengeCode = ref("");
const showToast = ref(false);
const toastType = ref("success"); // success | error

// mock数据
const myChallenges = ref([
  {
    id: 1,
    title: "万里长城徒步挑战",
    avatar: "/static/challenges/great-wall.jpg",
    distance: "78.121",
    progress: 80,
  },
  {
    id: 2,
    title: "撒哈拉沙漠穿越",
    avatar: "/static/challenges/sahara.jpg",
    distance: "156.8",
    progress: 45,
  },
  {
    id: 3,
    title: "丝绸之路探索",
    avatar: "/static/challenges/silk-road.jpg",
    distance: "89.5",
    progress: 92,
  },
  {
    id: 4,
    title: "亚马逊雨林冒险",
    avatar: "/static/challenges/amazon.jpg",
    distance: "67.3",
    progress: 38,
  },
  {
    id: 5,
    title: "喜马拉雅山脉挑战",
    avatar: "/static/challenges/great-wall.jpg",
    distance: "124.7",
    progress: 15,
  },
  {
    id: 6,
    title: "北极圈极地探险",
    avatar: "/static/challenges/sahara.jpg",
    distance: "45.2",
    progress: 73,
  },
]);

const challengeProjects = ref([
  {
    id: 1,
    title: "万里长城征途",
    description: "踏上古老长城，感受千年历史的厚重",
    image: "/static/challenges/great-wall.jpg",
    isLiked: false,
  },
  {
    id: 2,
    title: "撒哈拉沙漠探索",
    description: "穿越金色沙海，挑战极限耐力",
    image: "/static/challenges/sahara.jpg",
    isLiked: true,
  },
  {
    id: 3,
    title: "亚马逊雨林冒险",
    description: "深入神秘雨林，探寻自然奥秘",
    image: "/static/challenges/amazon.jpg",
    isLiked: false,
  },
  {
    id: 4,
    title: "丝绸之路重走",
    description: "重走古丝路，体验商旅文化",
    image: "/static/challenges/silk-road.jpg",
    isLiked: false,
  },
]);

const faqList = ref([
  {
    id: 1,
    question: "如何开始我的第一个挑战？",
    answer:
      "在挑战广场选择适合的项目，点击加入挑战即可开始您的征程。建议新手先从简单的挑战开始。",
  },
  {
    id: 2,
    question: "挑战口令是什么？如何使用？",
    answer:
      "挑战口令是特殊的邀请码，输入后可以解锁专属挑战或获得额外奖励。口令通常由官方或好友分享。",
  },
  {
    id: 3,
    question: "如何邀请朋友一起参加挑战？",
    answer:
      "在挑战详情页面点击邀请按钮，分享给您的朋友即可组队挑战。组队完成挑战会获得额外的团队奖励。",
  },
  {
    id: 4,
    question: "完成挑战后会获得什么奖励？",
    answer:
      "完成挑战将获得相应的勋章、积分和专属称号，还有机会获得实物奖励。不同难度的挑战奖励也不同。",
  },
  {
    id: 5,
    question: "如何查看我的挑战进度？",
    answer:
      "在个人中心或挑战详情页面都可以查看您的实时进度和历史记录。系统会自动记录您的运动数据。",
  },
]);

// 计算属性
const userInfo = computed(() => userStore.userInfo);
const activeChallenges = computed(() => challengeStore.activeChallenges);

// 方法
const navigateTo = (url: string) => {
  const tabBarPages = [
    "/pages/index/index",
    "/pages/record/index",
    "/pages/message/index",
    "/pages/profile/index",
  ];

  if (tabBarPages.includes(url)) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
};

const handleLikeProject = (projectId: number) => {
  const project = challengeProjects.value.find((p) => p.id === projectId);
  if (project) {
    project.isLiked = !project.isLiked;
  }
};

const handleJoinProject = (projectId: number) => {
  navigateTo(`/pages/challenge-detail/index?projectId=${projectId}`);
};

const handleCardClick = (projectId: number) => {
  navigateTo(`/pages/route-detail/index?id=${projectId}`);
};

const submitChallengeCode = () => {
  if (!challengeCode.value.trim()) {
    return;
  }

  // 模拟验证逻辑，这里可以根据实际需求修改
  // 假设有效的口令包含 "2024" 或 "challenge" 等关键词
  const validCodes = ["2024", "challenge", "success", "great-wall", "sahara"];
  const isValid = validCodes.some((code) =>
    challengeCode.value.toLowerCase().includes(code.toLowerCase())
  );

  if (isValid) {
    toastType.value = "success";
    showToast.value = true;
    challengeCode.value = ""; // 清空输入
  } else {
    toastType.value = "error";
    showToast.value = true;
  }

  // 2秒后自动隐藏弹框
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

const handleFaqClick = (faqId: number) => {
  console.log("点击FAQ:", faqId);
  console.log("点击FAQ:", faqId);
  // 跳转到问题详情页面
  uni.navigateTo({
    url: `/pages/faq-detail/index?id=${faqId}`,
  });
};

onMounted(() => {
  console.log("首页加载完成");
  console.log("我的挑战数量:", myChallenges.value.length);
  console.log("挑战项目数量:", challengeProjects.value.length);
  console.log("FAQ数量:", faqList.value.length);
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #1c1f26;
  min-height: 100vh;
  color: #ffffff;
}

/* 顶部搜索栏 */
.search-header {
  padding: 100rpx 30rpx 20rpx 30rpx;
}

.search-bar {
  width: 70%;
  background: #2a2d36;
  border-radius: 50rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  margin-right: 20rpx;
  .item-input {
    background: transparent;
  }
}

/* 挑战口令输入区域 */
.challenge-code-section {
  height: 192rpx;
  width: 686rpx;
  margin: 30rpx;
  box-sizing: border-box;
  background: #FADB47;
  border-radius: 16rpx;
  padding: 30rpx;
  .section-title {
    color: #333;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 20rpx;
    display: block;
  }
}

.input-area {
  display: flex;
  height: 80rpx;
  align-items: center;
  overflow: hidden;
}

.code-input {
  flex: 1;
  color: #999;
  padding: 25rpx 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  border: none;
  border-radius: 15rpx;
  background: #fff;
}

.submit-btn {
  width: 80rpx;
  height: 80rpx;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
}

.arrow {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

/* 我的挑战 */
.my-challenges {
  margin: 48rpx 0;
  padding: 0 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  .section-title {
    color: #fff;
    font-size: 34rpx;
    font-weight: 500;
  }
}

.more-icon {
  width: 24rpx;
  height: 48rpx;
}

.challenge-scroll {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
}

.challenge-item {
  display: inline-flex;
  align-items: center;
  width: 454rpx;
  height: 152rpx;
  padding: 24rpx 32rpx;
  margin-right: 20rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.challenge-avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.challenge-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.challenge-title {
  font-size: 34rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
  color: rgba(0, 0, 0, 0.85);
}

.challenge-stats {
  width: 270rpx;
  height: 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rpx;
  .distance-icon {
    width: 32rpx;
    height: 32rpx;
  }
}

.distance {
  font-size: 34rpx;
  font-weight: 600;
  color: #7b412d;
}
.distance-unit {
  font-size: 24rpx;
  font-weight: normal;
  color: #7b412d;
}

.progress {
  color: #00778a;
  font-size: 34rpx;
  font-weight: 600;
}

.progress-unit {
  font-size: 24rpx;
  color: #00778a;
  font-weight: normal;
}

/* 挑战项目 */
.challenge-projects {
  margin: 30rpx;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

/* 挑战卡片样式已移动到组件中 */

.view-all-btn {
  width: 686rpx;
  height: 80rpx;
  background: #fadb47;
  color: #242a36;
  border: none;
  border-radius: 8rpx;
  font-size: 34rpx;
  font-weight: 500;
}

/* 常见问题解答 */
.faq-section {
  margin: 30rpx;
  margin-bottom: 100rpx;

  .section-header {
    padding: 0;
    margin-bottom: 20rpx;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:active {
      opacity: 0.7;
    }
  }
}

.faq-list {
  background: #2a2d36;
  overflow: hidden;
}

.faq-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #333;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: #f4f5f9;
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  &:active {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  color: rgba(0, 0, 0, 0.85);
  font-size: 28rpx;
  flex: 1;
  line-height: 1.4;
  display: flex;
  align-items: center;

  // &::before {
  //   content: "?";
  //   display: inline-block;
  //   width: 32rpx;
  //   height: 32rpx;
  //   background: #165dff;
  //   color: white;
  //   text-align: center;
  //   line-height: 32rpx;
  //   border-radius: 50%;
  //   font-size: 20rpx;
  //   margin-right: 20rpx;
  //   flex-shrink: 0;
  // }
}

/* 弹框提示 */
.toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.toast-container {
  width: 272rpx;
  height: 272rpx;
  border-radius: 24rpx;
  background: #4c4c4c;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: toastShow 0.3s ease-out;
}

.toast-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.toast-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 20rpx;
}

.toast-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
}

@keyframes toastShow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
