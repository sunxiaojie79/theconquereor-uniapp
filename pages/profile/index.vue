<template>
  <view class="page">
    <!-- 用户信息区域 -->
    <view class="user-section">
      <view class="user-info">
        <button
          class="avatar-button"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <image
            class="user-avatar"
            :src="userInfo.avatar"
            mode="aspectFill"
          ></image>
        </button>
        <text class="user-name" @click="showNicknameModal">{{
          userInfo.nickname
        }}</text>
        <!-- <input type="nickname" class="user-name" placeholder="微信用户" /> -->
      </view>
      <image
        class="settings-icon"
        src="/static/settings.png"
        mode="aspectFill"
        @click="navigateToSettings"
      ></image>
    </view>

    <!-- 运动数据统计 -->
    <view class="stats-section">
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-label">累计跑量</text>
          <text class="stat-value">{{ distanceInfo.totalDistance }}km</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">本月跑量</text>
          <text class="stat-value">{{ distanceInfo.monthDistance }}km</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">本年跑量</text>
          <text class="stat-value">{{ distanceInfo.yearDistance }}km</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @click="handleAuth">
          <image
            class="action-icon"
            src="/static/auth.png"
            mode="aspectFill"
          ></image>
          <text class="action-text">授权</text>
        </view>
        <view class="action-btn" @click="handleOrder">
          <image
            class="action-icon"
            src="/static/shopping-bag.png"
            mode="aspectFill"
          ></image>
          <text class="action-text">订单</text>
        </view>
        <view class="action-btn" @click="handleJoin">
          <image
            class="action-icon"
            src="/static/join.png"
            mode="aspectFill"
          ></image>
          <text class="action-text">加入</text>
        </view>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tab-header">
        <view
          class="tab-item"
          :class="{ active: currentTab === 'challenge' }"
          @click="switchTab('challenge')"
        >
          <text class="tab-text">挑战项目</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'sports' }"
          @click="switchTab('sports')"
        >
          <text class="tab-text">运动类型</text>
        </view>
      </view>
    </view>
    <!-- 挑战项目提示 -->
    <text class="content-tip">你有2个进行中，1个挑战成功</text>
    <!-- 挑战项目内容 -->
    <view class="content-section" v-if="currentTab === 'challenge'">
      <scroll-view class="card-scroll" scroll-x="true" show-scrollbar="false">
        <view class="card-list">
          <view
            v-for="(item, index) in challengeList"
            :key="index"
            class="challenge-card"
            @click="navigateToChallenge(item.id)"
          >
            <image class="card-icon" :src="item.icon" mode="aspectFill"></image>
            <image class="card-bg" :src="item.image" mode="aspectFill"></image>
            <view class="card-content">
              <view class="card-info">
                <text class="card-title">{{ item.name }}</text>
                <view class="card-stats">
                  <view class="stat-row">
                    <text class="card-label">里程</text>
                    <view style="color: #7b412d">
                      <text class="card-value">{{ item.distance }}</text>
                      <text class="card-value-unit">km</text>
                    </view>
                  </view>
                  <view class="stat-row">
                    <text class="card-label">天数</text>
                    <view style="color: #00778a">
                      <text class="card-value">{{ item.days }}</text>
                      <text class="card-value-unit">days</text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="card-status">
                <view
                  class="status-btn"
                  :class="item.status"
                  @click.stop="handleChallengeAction(item)"
                >
                  <text class="status-text">{{ item.statusText }}</text>
                </view>
              </view>
              <text class="card-description">{{ item.description }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 运动类型内容 -->
    <view class="content-section" v-if="currentTab === 'sports'">
      <scroll-view class="card-scroll" scroll-x="true" show-scrollbar="false">
        <view class="card-list">
          <view
            v-for="(item, index) in sportsList"
            :key="index"
            class="sports-card"
            @click="navigateToSports(item.id)"
          >
            <view class="sports-header">
              <text class="sports-title">{{ item.name }}</text>
              <text class="badge-text">{{ item.badgeText }}</text>
            </view>
            <image
              class="sports-icon"
              :src="item.icon"
              mode="aspectFill"
            ></image>
            <view class="sports-stats">
              <view class="sports-total">
                <view class="sports-stat1">
                  <text class="stat1-label">此活动总里程</text>
                  <text class="stat1-value">{{ item.totalDistance }}</text>
                </view>
                <view class="sports-stat2">
                  <text class="stat2-label">总计</text>
                  <text class="stat2-value">{{ item.percentage }}%</text>
                </view>
              </view>
              <view class="sports-progress">
                <view class="progress-info" style="background: #fadb47">
                  <text class="progress-label">本月</text>
                  <text class="progress-value">{{ item.monthDistance }}</text>
                </view>
                <view class="progress-info" style="background: #aaaaaa">
                  <text class="progress-label">本年</text>
                  <text class="progress-value">{{ item.yearDistance }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-section">
      <view class="bottom-btn" @click="planNextChallenge">
        <text class="bottom-btn-text">计划你的下一个挑战</text>
      </view>
    </view>
  </view>

  <!-- 昵称编辑弹框 -->
  <view
    class="nickname-modal"
    v-if="showNicknameEdit"
    @click="closeNicknameModal"
  >
    <view class="nickname-content" @click.stop>
      <view class="nickname-header">
        <text class="nickname-title">编辑昵称</text>
      </view>
      <view class="nickname-body">
        <input
          type="nickname"
          class="nickname-input"
          placeholder="请输入昵称"
          v-model="tempNickname"
          @blur="onNicknameBlur"
          maxlength="20"
        />
      </view>
      <view class="nickname-footer">
        <view class="nickname-btn-group">
          <view class="nickname-btn cancel" @click="closeNicknameModal">
            <text class="nickname-btn-text">取消</text>
          </view>
          <view class="nickname-btn confirm" @click="confirmNickname">
            <text class="nickname-btn-text">确认</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 授权弹框 -->
  <view class="auth-modal" v-if="showAuthModal" @click="closeAuthModal">
    <view class="auth-content" @click.stop>
      <view class="auth-header">
        <text class="auth-title">授权</text>
      </view>
      <view class="auth-body">
        <view class="auth-body-left">
          <image
            class="wechat-icon"
            src="/static/wechat.png"
            mode="aspectFill"
          ></image>
          <text class="auth-status">微信运动</text>
        </view>
        <text
          class="auth-status-text"
          :style="{ color: isAuthorized ? '#07C160' : '#242A36' }"
          >{{ isAuthorized ? "已授权" : "未授权" }}</text
        >
      </view>
      <view class="auth-footer">
        <view class="auth-btn" @click="handleAuthAction">
          <text class="auth-btn-text">{{
            isAuthorized ? "取消授权" : "授权"
          }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores";

const userStore = useUserStore();

// 响应式数据
const currentTab = ref("challenge");
const challengeList = ref([]);
const sportsList = ref([]);
const showAuthModal = ref(false);
const isAuthorized = ref(false); // 授权状态，这里可以从用户数据中获取

// 昵称编辑相关
const showNicknameEdit = ref(false);
const tempNickname = ref("");

// 计算属性
const userInfo = computed(() => userStore.userInfo);
const distanceInfo = ref({
  monthDistance: 0,
  totalDistance: 0,
  yearDistance: 0,
});

// 获取用户信息
const getUserInfo = async () => {
  const res: any = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/my/info",
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getUserInfo ~ res:", res);
  if (res.data.code === 200) {
    distanceInfo.value = res.data.data;
  }
};
// 头像选择处理
const onChooseAvatar = (e: any) => {
  const { avatarUrl } = e.detail;
  if (avatarUrl) {
    // 更新用户头像
    userStore.updateUserInfo({ avatar: avatarUrl });
    uni.showToast({
      title: "头像更新成功",
      icon: "success",
    });
  }
};

// Tab切换
const switchTab = (tab: string) => {
  currentTab.value = tab;
};

// 导航方法
const navigateToSettings = () => {
  uni.navigateTo({
    url: "/pages/settings/index",
  });
};

const navigateToChallenge = (id: string) => {
  uni.navigateTo({
    url: `/pages/route-detail/index?id=${id}`,
  });
};

const navigateToSports = (id: string) => {
  uni.navigateTo({
    url: `/pages/my-sports/index?id=${id}`,
  });
};

const planNextChallenge = () => {
  uni.navigateTo({
    url: "/pages/challenge-square/index",
  });
};

// 昵称编辑相关方法
const showNicknameModal = () => {
  tempNickname.value = userInfo.value.nickname;
  showNicknameEdit.value = true;
};

const closeNicknameModal = () => {
  showNicknameEdit.value = false;
};

const onNicknameBlur = () => {
  // 可以在这里添加昵称验证逻辑
};

const confirmNickname = () => {
  if (tempNickname.value.trim() === "") {
    uni.showToast({
      title: "昵称不能为空",
      icon: "none",
    });
    return;
  }
  userStore.updateUserInfo({ nickname: tempNickname.value.trim() });
  uni.showToast({
    title: "昵称修改成功",
    icon: "success",
  });
  closeNicknameModal();
};

// 操作按钮事件
const handleAuth = () => {
  // 这里可以从用户数据或本地存储中获取授权状态
  // 示例：从用户store中获取授权状态
  // isAuthorized.value = userStore.isWeChatSportAuthorized;

  showAuthModal.value = true;
};

const closeAuthModal = () => {
  showAuthModal.value = false;
};

const handleAuthAction = () => {
  if (isAuthorized.value) {
    // 取消授权
    uni.showModal({
      title: "取消授权",
      content: "确定要取消微信运动授权吗？",
      success: (res) => {
        if (res.confirm) {
          isAuthorized.value = false;
          // 这里可以调用API取消授权
          // userStore.cancelWeChatSportAuth();
          uni.showToast({
            title: "已取消授权",
            icon: "success",
          });
          closeAuthModal();
        }
      },
    });
  } else {
    // 授权
    // 这里可以调用微信运动授权API
    // 模拟授权成功
    isAuthorized.value = true;
    // userStore.authorizeWeChatSport();
    uni.showToast({
      title: "授权成功",
      icon: "success",
    });
    closeAuthModal();
  }
};

const handleOrder = () => {
  uni.navigateTo({
    url: "/pages/order-list/index",
  });
};

const handleJoin = () => {
  uni.navigateTo({
    url: "/pages/join-challenge/index",
  });
};

const handleChallengeAction = (item: any) => {
  if (item.status === "success") {
    uni.showToast({
      title: "挑战已完成",
      icon: "success",
    });
  } else {
    uni.navigateTo({
      url: `/pages/route-detail/index?id=${item.id}`,
    });
  }
};

// 初始化数据
const initChallengeList = () => {
  challengeList.value = [
    {
      id: "challenge1",
      name: "挑战名称",
      image: "/static/bg/challenge.png",
      icon: "/static/bg/challenge-icon.png",
      distance: "161.2",
      days: "14",
      status: "success",
      statusText: "挑战成功",
      description: "你在14天内完成了挑战，点击查看详情",
    },
    {
      id: "challenge2",
      name: "挑战名称",
      image: "/static/bg/challenge.png",
      icon: "/static/bg/challenge-icon.png",
      distance: "161.2",
      days: "14",
      status: "progress",
      statusText: "挑战中",
      description: "你在14天内完成了挑战，点击查看详情",
    },
    {
      id: "challenge3",
      name: "挑战名称",
      image: "/static/bg/challenge.png",
      icon: "/static/bg/challenge-icon.png",
      distance: "161.2",
      days: "14",
      status: "not-start",
      statusText: "未开始",
      description: "你在14天内完成了挑战，点击查看详情",
    },
    {
      id: "challenge4",
      name: "挑战名称",
      image: "/static/bg/challenge.png",
      icon: "/static/bg/challenge-icon.png",
      distance: "161.2",
      days: "14",
      status: "progress",
      statusText: "挑战中",
      description: "你在14天内完成了挑战，点击查看详情",
    },
    {
      id: "challenge5",
      name: "挑战名称",
      image: "/static/bg/challenge.png",
      icon: "/static/bg/challenge-icon.png",
      distance: "161.2",
      days: "14",
      status: "progress",
      statusText: "挑战中",
      description: "你在14天内完成了挑战，点击查看详情",
    },
  ];
};

const initSportsList = () => {
  sportsList.value = [
    {
      id: "running",
      name: "跑步",
      badgeText: "RUNNING",
      icon: "/static/sports/running.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
    {
      id: "indoor",
      name: "室内跑步",
      badgeText: "RUNNING INDOOR",
      icon: "/static/sports/runningindoor.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
    {
      id: "walking",
      name: "步行",
      badgeText: "WALKING",
      icon: "/static/sports/walking.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
    {
      id: "walkingindoor",
      name: "室内步行",
      badgeText: "WALKING INDOOR",
      icon: "/static/sports/walkingindoor.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
    {
      id: "cycling",
      name: "骑行",
      badgeText: "CYCLING",
      icon: "/static/sports/cycling.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
    {
      id: "swimming",
      name: "游泳",
      badgeText: "SWIMMING",
      icon: "/static/sports/swimming.png",
      totalDistance: "161.20 km",
      percentage: "40",
      monthDistance: "0.00 km",
      yearDistance: "45.00 km",
    },
  ];
};

onMounted(() => {
  initChallengeList();
  initSportsList();
  getUserInfo();
  // 初始化昵称
  tempNickname.value = userStore.userInfo.nickname;

  // 模拟从用户数据中获取授权状态
  // 这里可以从userStore或本地存储中获取
  // isAuthorized.value = userStore.isWeChatSportAuthorized;

  // 为了测试目的，随机设置授权状态
  isAuthorized.value = Math.random() > 0.5;

  console.log("我的页面加载完成", { isAuthorized: isAuthorized.value });
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242a36;
  min-height: calc(100vh - 120rpx);
  padding-bottom: 120rpx;
}

.user-section {
  width: 686rpx;
  height: 96rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  padding-bottom: 16rpx;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-button {
  background: transparent;
  height: 80rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.user-name {
  font-size: 34rpx;
  font-weight: 500;
  color: #fff;
}

.settings-icon {
  width: 40rpx;
  height: 40rpx;
}

.stats-section {
  width: 686rpx;
  height: 216rpx;
  margin: 0 32rpx 16rpx 32rpx;
  border-radius: 24rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.stats-row {
  width: 686rpx;
  height: 144rpx;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-radius: 16rpx 16rpx 0px 0px;
  background: #434a58;
  box-sizing: border-box;
}

.stat-item {
  height: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 500;
  color: #fff;
}

.action-buttons {
  width: 686rpx;
  height: 72rpx;
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-radius: 0px 0px 16rpx 16rpx;
  background: #fff;
  box-sizing: border-box;
}

.action-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.action-text {
  font-size: 28rpx;
  color: #3d3d3d;
  font-weight: 500;
}

.tab-section {
  width: 686rpx;
  height: 88rpx;
  margin: 0 32rpx 24rpx 32rpx;
}

.tab-header {
  height: 88rpx;
  box-sizing: border-box;
  display: flex;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.15);
}

.tab-item {
  flex: 1;
  line-height: 88rpx;
  text-align: center;
  position: relative;
}

.tab-item.active {
  .tab-text {
    color: #fadb47;
  }
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 4rpx;
  background-color: #fadb47;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 34rpx;
  color: white;
  font-weight: 500;
}

.content-tip {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 686rpx;
  height: 46rpx;
  padding: 8rpx 32rpx;
  box-sizing: border-box;
  margin: 0 32rpx 24rpx 32rpx;
  border-radius: 8rpx;
  background: #313743;
  color: rgba(255, 255, 255, 0.85);
  font-size: 28rpx;
}
.content-section {
  padding: 0 32rpx;
  margin-bottom: 48rpx;
}

.card-scroll {
  white-space: nowrap;
}

.card-list {
  display: inline-flex;
  gap: 32rpx;
  padding-right: 32rpx;
}

.challenge-card {
  position: relative;
  width: 400rpx;
  height: 564rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 24rpx 0px;
  z-index: 0;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #fff;
}
.card-icon {
  width: 112rpx;
  height: 112rpx;
  position: absolute;
  top: 80rpx;
  left: 144rpx;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2px solid #cdd5d7;
}
.card-bg {
  width: 400rpx;
  height: 208rpx;
}

.card-content {
  width: 400rpx;
  height: 332rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
}

.card-title {
  display: block;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
  margin-bottom: 24rpx;
}

.card-stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24rpx;
}

.stat-row {
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.card-label {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}
.card-value {
  font-size: 34rpx;
  font-weight: 600;
}
.card-value-unit {
  font-size: 24rpx;
  margin-left: 4rpx;
}
.card-status {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;
}
.status-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56rpx;
  padding: 8rpx 16rpx;
  border-radius: 40rpx;
  text-align: center;
  box-sizing: border-box;
  &.success {
    width: 156rpx;
    background-color: #caf9e0;
    border: 2rpx solid #71cbac;
  }

  &.progress {
    width: 148rpx;
    background-color: rgba(250, 219, 71, 0.4);
    border: 2rpx solid #fadb47;
  }
  &.not-start {
    width: 148rpx;
    background-color: rgba(145, 156, 178, 0.2);
    border: 2rpx solid #919cb2;
  }
}

.status-text {
  font-size: 28rpx;
  color: #242a36;
  font-weight: 500;
}

.card-description {
  width: 336rpx;
  height: 68rpx;
  display: flex;
  text-align: center;
  line-height: 34rpx;
  font-size: 24rpx;
  color: rgba(0, 0, 0, 0.45);
  white-space: normal;
}

.sports-card {
  position: relative;
  width: 400rpx;
  height: 564rpx;
  background: #faf7f4;
  border-radius: 24rpx;
  padding: 24rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2rpx solid #fadb47;
}

.sports-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.sports-title {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.65);
}

.badge-text {
  font-size: 68rpx;
  color: #fadb47;
  font-weight: 600;
  margin-top: 16rpx;
  line-height: 68rpx;
  -webkit-text-stroke: 1px #fadb47;
  white-space: normal;
}
.sports-icon {
  width: 160rpx;
  height: 160rpx;
  position: absolute;
  top: 152rpx;
  left: 120rpx;
  z-index: 10;
}
.sports-stats {
  width: 352rpx;
  height: 202rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
.sports-total {
  width: 352rpx;
  height: 114rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.sports-stat1 {
  width: 192rpx;
  height: 114rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24rpx;
  box-sizing: border-box;
  background: #242a36;
  .stat1-label {
    font-size: 24rpx;
    color: #fff;
  }
  .stat1-value {
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
  }
}
.sports-stat2 {
  width: 160rpx;
  height: 114rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24rpx;
  box-sizing: border-box;
  background: #fff;
  .stat2-label {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.65);
  }
  .stat2-value {
    font-size: 34rpx;
    font-weight: 600;
    color: #00778a;
  }
}
.sports-progress {
  width: 352rpx;
  height: 90rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.progress-info {
  display: flex;
  width: 176rpx;
  height: 90rpx;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8rpx 24rpx;
  box-sizing: border-box;
}

.progress-label {
  font-size: 24rpx;
  color: #666;
}

.progress-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.bottom-section {
  position: fixed;
  bottom: 32rpx;
  left: 0;
  right: 0;
  padding: 0 32rpx;
}

.bottom-btn {
  background-color: #fadb47;
  height: 80rpx;
  width: 686rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 80rpx;
}

.bottom-btn-text {
  font-size: 34rpx;
  color: #242a36;
  font-weight: 500;
}

/* 授权弹框样式 */
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.auth-content {
  width: 100%;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.auth-header {
  text-align: left;
  margin-bottom: 24rpx;
}

.auth-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}

.auth-body {
  width: 686rpx;
  height: 112rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #f4f5f9;
}

.auth-body-left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-icon {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;
}

.auth-status {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
}

.auth-status-text {
  font-size: 34rpx;
  color: #242a36;
}

.auth-footer {
  margin-top: 80rpx;
}

.auth-btn {
  width: 100%;
  height: 88rpx;
  background: #fadb47;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-btn-text {
  font-size: 32rpx;
  color: #242a36;
  font-weight: 600;
}

/* 昵称编辑弹框样式 */
.nickname-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.nickname-content {
  width: 100%;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
  background: white;
  border-radius: 24rpx 24rpx 0 0;
  animation: slideUp 0.3s ease-out;
}

.nickname-header {
  text-align: left;
  margin-bottom: 24rpx;
}

.nickname-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}

.nickname-body {
  width: 686rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #f4f5f9;
}

.nickname-input {
  width: 100%;
  height: 100%;
  font-size: 34rpx;
  color: #242a36;
  padding: 0 16rpx;
  box-sizing: border-box;
  border: 2rpx solid #cdd5d7;
  border-radius: 8rpx;
}

.nickname-footer {
  margin-top: 80rpx;
}

.nickname-btn-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.nickname-btn {
  width: 336rpx;
  height: 88rpx;
  background: #fadb47;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname-btn-text {
  font-size: 32rpx;
  color: #242a36;
  font-weight: 600;
}

.nickname-btn.cancel {
  background: #aaaaaa;
}
</style>
