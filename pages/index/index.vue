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
        @scroll="handleScroll"
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
            <text class="challenge-title">{{ challenge.challengeTitle }}</text>
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
                <text class="progress">{{ challenge.process }} </text>
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
        />
      </view>

      <button
        class="view-all-btn"
        @click="navigateTo('/pages/challenge-list/index')"
      >
        查看全部挑战项目
      </button>
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
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores";
import ChallengeCard from "@/components/challenge-card/index.vue";
import { Project } from "@/components/challenge-card/index.vue";

const userStore = useUserStore();

// 挑战口令相关
const challengeCode = ref("");
const showToast = ref(false);
const toastType = ref("success"); // success | error

// 分页相关状态
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const hasMore = ref(true);

// mock数据
const myChallenges = ref<any[]>([]);

const challengeProjects = ref<Project[]>([]);

const faqList = ref<any[]>([]);

// 接口
// 获取地区
const getArea = async (parentCode) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/area/list/${parentCode}`,
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getArea ~ res:", res);
  return res.data;
};
// 获取我的挑战
const getMyChallenges = async (page = 1, append = false) => {
  if (loading.value) return;

  loading.value = true;

  try {
    const res: any = await uni.request({
      url: "http://113.45.219.231:8005/prod-api/wx/app/my/challengeProject/list",
      method: "POST",
      header: {
        "X-WX-TOKEN": uni.getStorageSync("token"),
      },
      data: {
        query: {
          pageNum: page,
          pageSize: pageSize.value,
        },
      },
    });
    if (res.data.code === 200) {
      const { rows, total: totalCount } = res.data;

      if (append) {
        // 追加数据
        myChallenges.value = [...myChallenges.value, ...rows];
      } else {
        // 替换数据（首次加载）
        myChallenges.value = rows;
      }

      total.value = totalCount;
      pageNum.value = page;

      // 判断是否还有更多数据
      hasMore.value = myChallenges.value.length < totalCount;

      console.log(
        `加载第${page}页数据，当前总数：${myChallenges.value.length}，总记录数：${totalCount}`
      );
    }

    return res.data;
  } catch (error) {
    console.error("获取我的挑战失败:", error);
    uni.showToast({
      title: "加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};
// 获取挑战项目
const getChallengeList = async () => {
  const res: any = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/challengeProject/list",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {
      query: {
        pageNum: 1,
        pageSize: 10,
      },
    },
  });
  console.log("🚀 ~ getChallengeList ~ res:", res);
  if (res.data.code === 200) {
    challengeProjects.value = res.data.rows;
  }
  return res.data;
};
// 收藏挑战项目
const likeCollection = async (id) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/my/collection/${id}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getMyCollection ~ res:", res);
  return res.data;
};
// 取消收藏挑战项目
const cancelCollection = async (id) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/my/collection/remove/${id}`,
    method: "DELETE",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  return res.data;
};
// 获取我的收货地址
const getMyAddress = async () => {
  const res: any = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/my/address",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {},
  });
  console.log("🚀 ~ getMyAddress ~ res:", res);
  return res.data;
};
// 获取字典数据
const getDictData = async (dictType: string) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/dict/list/${dictType}`,
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getDictData ~ res:", res);
  if (res.data.code === 200) {
    uni.setStorageSync(dictType, res.data.rows);
  }
  return res.data;
};
// 获取Q&A列表
const getFaqList = async () => {
  const res: any = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/qa/list",
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getFaqList ~ res:", res);
  if (res.data.code === 200) {
    faqList.value = res.data.data.slice(0, 5);
  }
};
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

const handleScroll = (e: any) => {
  // 检测是否滑动到底部或接近底部
  const { scrollLeft, scrollWidth } = e.detail;

  // 计算剩余可滑动距离
  const remaining = scrollWidth - scrollLeft;

  console.log(
    `滑动状态: scrollLeft=${scrollLeft}, scrollWidth=${scrollWidth}, remaining=${remaining}`
  );

  // 当剩余距离小于阈值时（接近底部），且还有更多数据，且不在加载中
  if (remaining <= 600 && hasMore.value && !loading.value) {
    console.log("触发分页加载，加载第", pageNum.value + 1, "页");

    // 加载下一页数据
    getMyChallenges(pageNum.value + 1, true);
  }
};

const handleLikeProject = async (project: Project) => {
  if (project.collectFlag) {
    const res = await cancelCollection(project.id);
    console.log("🚀 ~ cancelCollection ~ res:", res);
    if (res.code === 200) {
      project.collectFlag = false;
    }
  } else {
    const res = await likeCollection(project.id);
    console.log("🚀 ~ likeCollection ~ res:", res);
    if (res.code === 200) {
      project.collectFlag = true;
    }
  }
};

const handleJoinProject = (projectId: number) => {
  navigateTo(`/pages/challenge-detail/index?projectId=${projectId}`);
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

const loginWX = async () => {
  console.log("登录");
  uni.login({
    success(res) {
      console.log("🚀 ~ success ~ res:", res);
      if (res.code) {
        //发起网络请求
        uni
          .request({
            url: "http://113.45.219.231:8005/prod-api/wx/user/login",
            data: {
              code: res.code,
            },
          })
          .then((res: any) => {
            console.log("🚀 ~ handleLogin ~ res:", res);
            if (res.data.code === 200) {
              userStore.updateUserInfo(res.data.data.userInfo);
              userStore.updateToken(res.data.data.token);
              uni.setStorageSync("token", res.data.data.token);
              getChallengeList();
              getMyChallenges(1, false); // 首次加载第1页数据
              getMyAddress();
              getDictData("operation_comp");
              getDictData("challenge_type");
              getArea("0");
              getFaqList();
            }
          });
      } else {
        console.log("登录失败！" + res.errMsg);
      }
    },
  });
};
onMounted(async () => {
  console.log("首页加载完成");
  console.log("我的挑战数量:", myChallenges.value.length);
  console.log("挑战项目数量:", challengeProjects.value.length);
  console.log("FAQ数量:", faqList.value.length);

  // 重置分页状态
  pageNum.value = 1;
  total.value = 0;
  hasMore.value = true;
  myChallenges.value = [];

  await loginWX();
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
  background: #fadb47;
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
  box-sizing: border-box;
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
  // justify-content: space-between;
  align-items: center;
  padding: 0rpx;
  .distance-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 16rpx;
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
  margin-right: 16rpx;
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
