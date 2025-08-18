<template>
  <view class="page">
    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tabs">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'add' }"
          @click="switchTab('add')"
        >
          <text class="tab-text">添加数据</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'data' }"
          @click="switchTab('data')"
        >
          <text class="tab-text">运动数据</text>
        </view>
      </view>
    </view>

    <!-- 添加数据页面 -->
    <view v-if="activeTab === 'add'" class="add-data-content">
      <!-- 添加运动数据卡片 -->
      <view class="add-data-card" @click="addSportsData('hand')">
        <view class="card-left">
          <image
            class="card-icon"
            src="/static/distance-active.png"
            mode="aspectFill"
          ></image>
        </view>
        <view class="card-content">
          <text class="card-title">添加运动数据</text>
          <text class="card-desc">添加距离、步数或转换活动类型</text>
        </view>
        <view class="card-right">
          <image
            class="arrow-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 已授权的运动APP -->
      <view class="authorized-section">
        <text class="section-title">已授权的运动APP</text>
        <view class="app-item-container">
          <view class="app-list">
            <view class="app-item">
              <image
                class="app-icon"
                src="/static/wechat.png"
                mode="aspectFill"
              ></image>
              <text class="app-name">微信运动</text>
            </view>
            <view class="" hover-class="none" hover-stop-propagation="false">
              <text
                class="step-text"
                selectable="false"
                space="false"
                decode="false"
              >
                {{ step }}步
              </text>
              <text
                class="step-text"
                selectable="false"
                space="false"
                decode="false"
              >
                {{ distance.toFixed(2) }}km
              </text>
            </view>
          </view>

          <!-- 添加新授权按钮 -->
          <view class="btn-container">
            <button class="add-auth-btn" @click="addNewAuth">
              <text class="add-auth-text">获取数据</text>
            </button>
            <button class="add-auth-btn" @click="addSportsData('wechat')">
              <text class="add-auth-text"> 添加运动数据</text>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 运动数据页面 -->
    <view v-if="activeTab === 'data'" class="sports-data-content">
      <view class="sports-data-list">
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="(item, index) in sportsDataList"
            :key="item.id"
            :index="index"
          >
            <view class="sports-data-item">
              <view class="item-content">
                <view class="item-left">
                  <view class="sport-icon">
                    <image
                      class="icon-image"
                      :src="`/static/sports/${item.sportIcon}.png`"
                      mode="aspectFill"
                    ></image>
                  </view>
                </view>
                <view class="item-center">
                  <view class="distance-info">
                    <text class="distance-value">{{ item.distance }}</text>
                    <text class="distance-unit">km</text>
                  </view>
                  <view class="source-info">
                    <image
                      v-if="item.dataSource === 'wechat'"
                      class="source-icon"
                      src="/static/wechat2.png"
                      mode="aspectFill"
                    ></image>
                    <text class="source-text">{{
                      item.dataSource === "wechat" ? "微信运动" : "手动录入"
                    }}</text>
                  </view>
                </view>
                <view class="item-right">
                  <text class="date-text">{{ item.duration }}</text>
                </view>
              </view>
            </view>
            <template v-slot:right>
              <view class="delete-btn-container">
                <view class="delete-btn">
                  <image
                    class="delete-icon"
                    src="/static/delete.png"
                    mode="aspectFill"
                    @click.stop="deleteSportsData(item.id)"
                  ></image>
                </view>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showDeleteModal"
      title="删除运动数据"
      message="确定要删除这条运动数据吗？删除后无法恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- 添加新授权弹窗 -->
    <ConfirmDialog
      v-model:visible="showAddAuthModal"
      title="授权绑定微信运动"
      message=""
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmAddAuth"
      @cancel="showAddAuthModal = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { baseurl } from "@/config/dev.env";

// 响应式数据
const activeTab = ref("add");
const sportsDataList = ref([]);
const showDeleteModal = ref(false);
const deleteId = ref("");
const showAddAuthModal = ref(false);
const step = ref(0);
const distance = ref(0);
// 解密微信运动数据
const decryptWeChatData = async (encryptedData: string, iv: string) => {
  const res: any = await uni.request({
    url: baseurl + "/wx/app/getWxStepInfo",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {
      encryptedData,
      iv,
    },
  });
  console.log("🚀 ~ decryptWeChatData ~ res:", res);
  if (res.data.code === 200) {
    const wechat_data = res.data.data.stepInfoList;
    const today_distance =
      (wechat_data[wechat_data.length - 1].step * 0.7) / 1000;
    step.value = wechat_data[wechat_data.length - 1].step;
    distance.value = today_distance;
    console.log(
      "🚀 ~ decryptWeChatData ~ wechat_data:",
      wechat_data,
      today_distance
    );
    uni.setStorageSync("today_distance", today_distance);

    uni.showToast({
      title: "授权成功",
      icon: "success",
    });
  }
  return res.data;
};
// 初始化运动数据
const getSportList = async () => {
  const res: any = await uni.request({
    url: baseurl + "/wx/app/my/distance/list",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {
      query: {
        pageNum: 1,
        pageSize: 100,
      },
    },
  });
  console.log("🚀 ~ getSportList ~ res:", res);
  sportsDataList.value = res.data.rows;
  if (sportsDataList.value.length > 0) {
    sportsDataList.value.forEach((item) => {
      if (item.challengeType === "跑步") {
        item.sportIcon = "running";
      } else if (item.challengeType === "骑行") {
        item.sportIcon = "cycling";
      } else if (item.challengeType === "游泳") {
        item.sportIcon = "swimming";
      } else if (item.challengeType === "室内跑步") {
        item.sportIcon = "runningindoor";
      } else if (item.challengeType === "步行") {
        item.sportIcon = "walking";
      } else if (item.challengeType === "室内步行") {
        item.sportIcon = "walkingindoor";
      } else {
        item.sportIcon = "running";
      }
    });
  }
};

// 方法
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const addSportsData = (type: string) => {
  uni.navigateTo({
    url: `/pages/add-sports-data/index?type=${type}`,
  });
};

const addNewAuth = () => {
  showAddAuthModal.value = true;
};

// 删除运动数据
const deleteSportsData = (id: string) => {
  deleteId.value = id;
  showDeleteModal.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (deleteId.value !== "") {
    const res = await uni.request({
      url: baseurl + `/wx/app/my/distance/${deleteId.value}`,
      method: "DELETE",
      header: {
        "X-WX-TOKEN": uni.getStorageSync("token"),
      },
    });
    console.log("🚀 ~ confirmDelete ~ res:", res);
    if (res.data.code === 200) {
      uni.showToast({
        title: "删除成功",
        icon: "success",
      });
      getSportList();
    } else {
      uni.showToast({
        title: "删除失败",
        icon: "error",
      });
    }
  }

  showDeleteModal.value = false;
  deleteId.value = "";
};

const confirmAddAuth = async () => {
  wx.getWeRunData({
    success: async (res) => {
      console.log("🚀 ~ success ~ res:", res);
      // 拿 encryptedData 到开发者后台解密开放数据
      const encryptedData = res.encryptedData;
      // 或拿 cloudID 通过云调用直接获取开放数据
      const iv = res.iv;
      const res2 = await decryptWeChatData(encryptedData, iv);
      console.log("🚀 ~ success ~ res2:", res2);
    },
  });
};

onShow(() => {
  getSportList();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242a36;
  min-height: 100vh;
  color: #ffffff;
}

/* Tab切换样式 - 参考challenge-list页面 */
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
      color: #fadb47;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #fadb47;
    }
  }
}

.tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #999;
}

/* 添加数据页面内容 */
.add-data-content {
  padding: 40rpx 30rpx;
}

.add-data-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 60rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-left {
  margin-right: 24rpx;
}

.card-icon {
  width: 48rpx;
  height: 48rpx;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.card-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.4;
}

.card-right {
  margin-left: 24rpx;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

/* 已授权的运动APP */
.authorized-section {
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 32rpx;
  display: block;
}
.app-item-container {
  padding: 32rpx;
  border-radius: 8rpx;
  background: #313743;
}
.app-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.app-item {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;
}

.app-name {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

.step-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  margin-right: 26rpx;
}

.btn-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26rpx;
}

.add-auth-btn {
  flex: 1;
  height: 88rpx;
  background-color: transparent;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;

  &::after {
    border: none;
  }
}

.add-auth-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

/* 运动数据页面内容 */
.sports-data-content {
  padding: 48rpx 32rpx;
}

.sports-data-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.sports-data-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 24rpx;
}

.item-left {
  margin-right: 24rpx;
}

.sport-icon {
  width: 88rpx;
  height: 88rpx;
  background-color: #fadb47;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 64rpx;
  height: 64rpx;
}

.item-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.distance-info {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.distance-value {
  font-size: 34rpx;
  font-weight: 600;
  color: #7b412d;
}

.distance-unit {
  font-size: 24rpx;
  color: #7b412d;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.source-icon {
  width: 32rpx;
  height: 32rpx;
}

.source-text {
  font-size: 28rpx;
  color: #666666;
}

.item-right {
}

.date-text {
  font-size: 28rpx;
  color: #999999;
}

/* 删除按钮样式 */
.delete-btn-container {
  width: 100rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f02525;
  color: #fff;
  border-radius: 50%;
  border: 1rpx solid rgba(0, 0, 0, 0.09);
}

.delete-icon {
  width: 32rpx;
  height: 32rpx;
}

.data-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999999;
  opacity: 0.8;
}
</style>
