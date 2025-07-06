<template>
  <view class="page">
    <!-- 数据列表 -->
    <view class="data-list">
      <view v-for="(item, index) in dataList" :key="item.id" class="data-item">
        <!-- 用户信息头部 -->
        <view class="user-header">
          <view class="user-info">
            <image
              class="user-avatar"
              :src="item.avatar"
              mode="aspectFill"
            ></image>
            <text class="user-name">{{ item.userName }}</text>
          </view>
          <view class="delete-btn" @click="deleteData(index)">
            <image
              class="delete-icon"
              src="/static/delete-gray.png"
              mode="aspectFill"
            ></image>
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
                <text class="distance-number">{{ item.distance }}</text>
                <text class="distance-unit">km</text>
              </view>
              <view class="date-info">
                <text class="date-text">{{ item.date }}</text>
              </view>
            </view>
          </view>
          <view class="source-info">
            <image
              class="source-icon"
              src="/static/wechat2.png"
              mode="aspectFill"
            ></image>
            <text class="source-text">{{ item.source }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 响应式数据
const dataList = ref<any[]>([]);

// 初始化数据列表
const initDataList = () => {
  const mockData = [];
  const userNames = [
    "用户名",
    "李四",
    "王五",
    "赵六",
    "钱七",
    "孙八",
    "周九",
    "吴十",
    "郑十一",
    "王十二",
  ];
  const avatars = [
    "/static/avatars/friend1.png",
    "/static/avatars/friend2.png",
    "/static/avatars/friend3.png",
    "/static/avatars/friend4.png",
  ];
  const distances = [
    "78.121",
    "65.432",
    "89.567",
    "45.321",
    "92.876",
    "34.567",
    "76.543",
    "58.901",
    "82.345",
    "71.890",
  ];
  const dates = [
    "2025.06.11",
    "2025.06.10",
    "2025.06.09",
    "2025.06.08",
    "2025.06.07",
    "2025.06.06",
    "2025.06.05",
    "2025.06.04",
    "2025.06.03",
    "2025.06.02",
  ];

  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      userName: userNames[i - 1],
      avatar: avatars[(i - 1) % 4],
      distance: distances[i - 1],
      date: dates[i - 1],
      source: "来自微信运动",
    });
  }

  dataList.value = mockData;
};

// 删除数据
const deleteData = (index: number) => {
  uni.showModal({
    title: "删除确认",
    content: "确定要删除这条运动数据吗？",
    success: (res) => {
      if (res.confirm) {
        dataList.value.splice(index, 1);
        uni.showToast({
          title: "删除成功",
          icon: "success",
        });
      }
    },
  });
};

onMounted(() => {
  initDataList();
  console.log("运动数据页面加载完成");
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
