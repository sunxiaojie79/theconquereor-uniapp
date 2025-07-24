<template>
  <view class="page">
    <!-- 数据列表 -->
    <view class="data-list">
      <view class="data-item">
        <!-- 用户信息头部 -->
        <view class="user-header">
          <view class="user-info">
            <image class="user-avatar" :src="avatar" mode="aspectFill"></image>
            <text class="user-name">{{ userNickname }}</text>
          </view>
          <view class="delete-btn" @click="deleteData()">
            <!-- <image
              class="delete-icon"
              src="/static/delete-gray.png"
              mode="aspectFill"
            ></image> -->
          </view>
        </view>
        <!-- 运动数据部分 -->
        <view class="sports-data">
          <view class="sports-icon-container">
            <image
              class="sports-icon"
              src="/static/sports/running.png"
              mode="aspectFill"
            ></image>
            <view class="sports-info">
              <view class="distance-info">
                <text class="distance-number">{{
                  (contentInfo.appChallengeProject?.distance *
                    contentInfo.appScenicSpot?.completionProgress) /
                    100 || 0
                }}</text>
                <text class="distance-unit">km</text>
              </view>
              <view class="date-info">
                <text class="date-text">{{
                  contentInfo.appScenicSpot?.date
                }}</text>
              </view>
            </view>
          </view>
          <view class="source-info">
            <image
              v-if="contentInfo.appScenicSpot?.source === '微信运动'"
              class="source-icon"
              src="/static/wechat2.png"
              mode="aspectFill"
            ></image>
            <text class="source-text">{{
              contentInfo.appScenicSpot?.source
            }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 删除确认弹框 -->
    <ConfirmDialog
      v-model:visible="showDeleteModal"
      title="删除消息"
      message="确定要删除这条消息吗？删除后无法恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { useUserStore } from "@/stores";
const userStore = useUserStore();

const contentInfo = ref({
  appChallengeProject: { distance: 0 },
  appScenicSpot: {
    completionProgress: 0,
    date: "暂无数据",
    source: "暂无数据",
  },
});
const avatar = uni.getStorageSync("avatar");
const userNickname =
  userStore.userInfo.userNickname || uni.getStorageSync("userNickname");
const showDeleteModal = ref(false);

// 删除数据
const deleteData = () => {
  // deleteIndex.value = index;
  // showDeleteModal.value = true;
};

const confirmDelete = () => {
  // if (deleteIndex.value !== -1) {
  //   dataList.value.splice(deleteIndex.value, 1);
  //   uni.showToast({
  //     title: "删除成功",
  //     icon: "success",
  //   });
  // }
  // showDeleteModal.value = false;
  // deleteIndex.value = -1;
};
// 获取消息详情
const getMessageDetail = async (id: string) => {
  const res: any = await uni.request({
    url: `http://113.45.219.231:8005/prod-api/wx/app/my/notice/detail/${id}`,
    method: "GET",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ getMessageDetail ~ res:", res);
  if (res.data.code === 200) {
    contentInfo.value = res.data.data;
  }
};
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log("内容详情页面加载完成");
  const id = currentPage.options.id;
  console.log("🚀 ~ onMounted ~ id:", id);
  if (id) {
    getMessageDetail(id);
  }
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #242a36;
  min-height: 100vh;
  padding: 32rpx;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.data-item {
  width: 686rpx;
  height: 314rpx;
  padding: 32rpx;
  gap: 32rpx;
  border-radius: 16rpx;
  background: #ffffff;
  box-sizing: border-box;
  border-width: 0px 0px 1rpx 0px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.09);
}

/* 用户信息头部 */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 32rpx;
  margin-bottom: 32rpx;
  border-width: 0px 0px 1rpx 0px;
  border-style: dashed;
  border-color: rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.user-name {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.delete-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  width: 48rpx;
  height: 48rpx;
}

/* 运动数据部分 */
.sports-data {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.sports-icon-container {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sports-icon {
  width: 88rpx;
  height: 88rpx;
  background: #fadb47;
  border-radius: 16rpx;
  margin-right: 16rpx;
}

.sports-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distance-info {
  display: flex;
  align-items: baseline;
  flex: 1;
}

.distance-number {
  font-size: 48rpx;
  color: #8b4513;
  font-weight: 600;
  margin-right: 8rpx;
}

.distance-unit {
  font-size: 28rpx;
  color: #8b4513;
}

.date-info {
  text-align: right;
}

.date-text {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.source-info {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: right;
  flex: 1;
  justify-content: flex-end;
}

.source-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.source-text {
  font-size: 24rpx;
  color: rgba(0, 0, 0, 0.45);
}
</style>
