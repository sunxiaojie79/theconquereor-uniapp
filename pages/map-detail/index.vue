<template>
  <view class="page">
    <!-- 顶部信息卡片 -->
    <view class="route-info-card">
      <view class="route-header">
        <image
          :src="routeData.image"
          mode="aspectFill"
          class="route-image"
        ></image>
        <view class="route-details">
          <text class="route-name">{{ routeData.name }}</text>
          <text class="route-distance">{{ routeData.distance }}公里</text>
          <text class="route-progress">已完成 {{ userProgress }}%</text>
        </view>
      </view>

      <view class="progress-bar">
        <view class="progress-track">
          <view
            class="progress-fill"
            :style="{ width: userProgress + '%' }"
          ></view>
        </view>
        <text class="progress-text"
          >{{ completedDistance }}/{{ routeData.distance }}公里</text
        >
      </view>
    </view>

    <!-- 地图容器 -->
    <view class="map-container">
      <!-- 高德地图 -->
      <map
        id="amap"
        class="map"
        :longitude="mapCenter.longitude"
        :latitude="mapCenter.latitude"
        :scale="mapScale"
        :markers="markers"
        :polyline="polylineData"
        :show-location="true"
        @markertap="onMarkerTap"
        @regionchange="onRegionChange"
      >
        <!-- 地图控件 -->
        <cover-view class="map-controls">
          <cover-view class="control-btn" @tap="locateUser">
            <cover-view class="control-text">📍</cover-view>
          </cover-view>
          <cover-view class="control-btn" @tap="zoomIn">
            <cover-view class="control-text">➕</cover-view>
          </cover-view>
          <cover-view class="control-btn" @tap="zoomOut">
            <cover-view class="control-text">➖</cover-view>
          </cover-view>
        </cover-view>
      </map>
    </view>

    <!-- 地图图例说明 -->
    <view class="map-legend">
      <view class="legend-item">
        <view class="legend-dot start"></view>
        <text class="legend-text">埃菲尔铁塔</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot checkpoint"></view>
        <text class="legend-text">塞纳河景点</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot current"></view>
        <text class="legend-text">当前位置</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot finish"></view>
        <text class="legend-text">植物园</text>
      </view>
    </view>

    <!-- 里程碑列表 -->
    <view class="milestones-section">
      <view class="section-header">
        <text class="section-title">塞纳河沿岸景点</text>
        <text class="section-subtitle"
          >{{ completedMilestones }}/{{
            routeData.milestones.length
          }}
          已打卡</text
        >
      </view>

      <view class="milestones-list">
        <view
          v-for="(milestone, index) in routeData.milestones"
          :key="index"
          class="milestone-item"
          :class="{
            completed: milestone.completed,
            current: milestone.current,
          }"
          @click="flyToMilestone(milestone)"
        >
          <view class="milestone-icon">
            <text v-if="milestone.completed">✓</text>
            <text v-else-if="milestone.current">📍</text>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="milestone-info">
            <text class="milestone-name">{{ milestone.name }}</text>
            <text class="milestone-desc">{{ milestone.description }}</text>
            <text class="milestone-distance"
              >{{ milestone.distance }}公里处</text
            >
          </view>
          <view class="milestone-status">
            <text v-if="milestone.completed" class="status-completed"
              >已打卡</text
            >
            <text v-else-if="milestone.current" class="status-current"
              >进行中</text
            >
            <text v-else class="status-upcoming">待探索</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @click="shareRoute">
        <text class="btn-text">分享路线</text>
      </button>
      <button class="action-btn primary" @click="startNavigation">
        <text class="btn-text">开始导航</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onLoad as onPageLoad } from "@dcloudio/uni-app";
import {
  amapConfig,
  getAmapKey,
  isAmapKeyConfigured,
  createMarkerConfig,
  createPolylineConfig,
} from "../../config/amap.js";

// 路线数据
const routeData = ref({
  id: "1",
  name: "巴黎塞纳河漫步挑战",
  image: "/static/challenges/silk-road.jpg", // 临时使用，建议添加塞纳河图片
  distance: 42,
  milestones: [
    {
      name: "埃菲尔铁塔",
      description: "巴黎的象征，铁娘子的起点",
      distance: 0,
      latitude: 48.8584,
      longitude: 2.2945,
      completed: true,
      current: false,
    },
    {
      name: "亚历山大三世桥",
      description: "巴黎最华丽的桥梁",
      distance: 8,
      latitude: 48.8634,
      longitude: 2.3135,
      completed: true,
      current: false,
    },
    {
      name: "奥赛博物馆",
      description: "印象派艺术的殿堂",
      distance: 15,
      latitude: 48.8601,
      longitude: 2.3266,
      completed: false,
      current: true,
    },
    {
      name: "卢浮宫",
      description: "世界最大的艺术博物馆",
      distance: 22,
      latitude: 48.8606,
      longitude: 2.3376,
      completed: false,
      current: false,
    },
    {
      name: "新桥",
      description: "巴黎最古老的桥梁",
      distance: 28,
      latitude: 48.8566,
      longitude: 2.3414,
      completed: false,
      current: false,
    },
    {
      name: "巴黎圣母院",
      description: "哥特式建筑的杰作",
      distance: 35,
      latitude: 48.853,
      longitude: 2.3499,
      completed: false,
      current: false,
    },
    {
      name: "植物园",
      description: "塞纳河东段的绿色终点",
      distance: 42,
      latitude: 48.8443,
      longitude: 2.3601,
      completed: false,
      current: false,
    },
  ],
});

const userProgress = ref(35.7);
const mapScale = ref(13);
const mapCenter = ref({
  latitude: 48.8601,
  longitude: 2.3266,
});

// 计算属性
const completedDistance = computed(() => {
  return Math.round((routeData.value.distance * userProgress.value) / 100);
});

const completedMilestones = computed(() => {
  return routeData.value.milestones.filter((m) => m.completed).length;
});

// 地图标记点
const markers = computed(() => {
  return routeData.value.milestones.map((milestone, index) => ({
    id: index,
    latitude: milestone.latitude,
    longitude: milestone.longitude,
    // 使用默认标记样式，通过label显示不同状态
    ...createMarkerConfig(),
    title: milestone.name,
    label: {
      content: milestone.completed
        ? "✓"
        : milestone.current
        ? "●"
        : (index + 1).toString(),
      color: milestone.completed
        ? amapConfig.themeColors.success
        : milestone.current
        ? amapConfig.themeColors.warning
        : amapConfig.themeColors.primary,
      fontSize: 16,
      borderRadius: 12,
      bgColor: "#ffffff",
      padding: 8,
    },
    callout: {
      content: milestone.name,
      color: "#ffffff",
      fontSize: 12,
      borderRadius: 8,
      bgColor: milestone.completed
        ? amapConfig.themeColors.success
        : milestone.current
        ? amapConfig.themeColors.primary
        : "#86909C",
      padding: 8,
      display: "ALWAYS",
    },
  }));
});

// 路线多段线
const polylineData = computed(() => {
  const points = routeData.value.milestones.map((m) => ({
    latitude: m.latitude,
    longitude: m.longitude,
  }));

  return [
    createPolylineConfig({
      points: points,
    }),
  ];
});

// 地图实例
let mapContext: any = null;

// 方法
const onMarkerTap = (e: any) => {
  const markerId = e.markerId;
  const milestone = routeData.value.milestones[markerId];

  uni.showModal({
    title: milestone.name,
    content: `${milestone.description}\n距离起点: ${milestone.distance}公里`,
    showCancel: false,
    confirmText: "知道了",
  });
};

const onRegionChange = (e: any) => {
  if (e.type === "end") {
    // 用户拖拽地图结束
    console.log("地图区域变化", e);
  }
};

const locateUser = () => {
  // 定位到用户当前位置
  uni.getLocation({
    type: "gcj02",
    success: (res) => {
      mapCenter.value = {
        latitude: res.latitude,
        longitude: res.longitude,
      };

      if (mapContext) {
        mapContext.moveToLocation();
      }
    },
    fail: () => {
      uni.showToast({
        title: "定位失败",
        icon: "none",
      });
    },
  });
};

const zoomIn = () => {
  if (mapScale.value < 18) {
    mapScale.value += 2;
  }
};

const zoomOut = () => {
  if (mapScale.value > 3) {
    mapScale.value -= 2;
  }
};

const flyToMilestone = (milestone: any) => {
  mapCenter.value = {
    latitude: milestone.latitude,
    longitude: milestone.longitude,
  };
  mapScale.value = 12;
};

const shareRoute = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
    success: () => {
      console.log("分享成功");
    },
    fail: () => {
      uni.showToast({
        title: "分享功能暂未开放",
        icon: "none",
      });
    },
  });
};

const startNavigation = () => {
  const currentMilestone = routeData.value.milestones.find((m) => m.current);
  if (currentMilestone) {
    uni.showModal({
      title: "开始导航",
      content: `前往下一个景点：${currentMilestone.name}\n${currentMilestone.description}`,
      confirmText: "出发",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          // 调用高德地图导航
          const url = `https://uri.amap.com/navigation?to=${currentMilestone.longitude},${currentMilestone.latitude}&toname=${currentMilestone.name}&dev=0&t=0`;

          // 在小程序中打开网页
          uni.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
          });
        }
      },
    });
  } else {
    uni.showToast({
      title: "恭喜！您已完成塞纳河漫步",
      icon: "success",
      duration: 2000,
    });
  }
};

onMounted(() => {
  // 检查高德地图配置
  // if (!isAmapKeyConfigured()) {
  //   uni.showModal({
  //     title: '地图配置提示',
  //     content: '请先配置高德地图API Key，详见项目文档 docs/amap-setup.md',
  //     showCancel: false
  //   })
  //   return
  // }

  // 获取地图实例
  mapContext = uni.createMapContext("amap");

  console.log("地图详情页面加载完成");
  // console.log("高德地图API Key:", getAmapKey());
});

// 页面加载参数
onPageLoad((options: any) => {
  if (options.routeId) {
    // 根据路线ID加载对应数据
    console.log("加载路线ID:", options.routeId);
    // 这里可以根据routeId更新routeData
  }
});

onUnmounted(() => {
  mapContext = null;
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f2f3f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.route-info-card {
  background: white;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.route-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.route-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.route-details {
  flex: 1;
}

.route-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1d2129;
  display: block;
  margin-bottom: 8rpx;
}

.route-distance {
  font-size: 28rpx;
  color: #4e5969;
  display: block;
  margin-bottom: 4rpx;
}

.route-progress {
  font-size: 24rpx;
  color: #165dff;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-track {
  flex: 1;
  height: 8rpx;
  background: #e5e6eb;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #165dff 0%, #4a90e2 100%);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 24rpx;
  color: #4e5969;
  min-width: 120rpx;
  text-align: right;
}

.map-container {
  position: relative;
  height: 600rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.control-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.control-text {
  font-size: 32rpx;
  color: #4e5969;
}

.map-legend {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;

  &.start {
    background: #00b42a;
  }

  &.checkpoint {
    background: #165dff;
  }

  &.current {
    background: #ff6b35;
  }

  &.finish {
    background: #f7931e;
  }
}

.legend-text {
  font-size: 22rpx;
  color: #4e5969;
}

.milestones-section {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1d2129;
}

.section-subtitle {
  font-size: 24rpx;
  color: #86909c;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.milestone-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
  transition: all 0.3s ease;

  &.completed {
    background: rgba(0, 180, 42, 0.1);
    border: 2rpx solid rgba(0, 180, 42, 0.2);
  }

  &.current {
    background: rgba(22, 93, 255, 0.1);
    border: 2rpx solid rgba(22, 93, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

.milestone-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
  background: #165dff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 20rpx;

  .completed & {
    background: #00b42a;
  }

  .current & {
    background: #ff6b35;
  }
}

.milestone-info {
  flex: 1;
}

.milestone-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1d2129;
  display: block;
  margin-bottom: 6rpx;
}

.milestone-desc {
  font-size: 24rpx;
  color: #4e5969;
  display: block;
  margin-bottom: 4rpx;
}

.milestone-distance {
  font-size: 22rpx;
  color: #86909c;
}

.milestone-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;

  .status-completed {
    color: #00b42a;
    background: rgba(0, 180, 42, 0.1);
    font-size: 22rpx;
    font-weight: 600;
  }

  .status-current {
    color: #ff6b35;
    background: rgba(255, 107, 53, 0.1);
    font-size: 22rpx;
    font-weight: 600;
  }

  .status-upcoming {
    color: #86909c;
    background: rgba(134, 144, 156, 0.1);
    font-size: 22rpx;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 40rpx;
  left: 20rpx;
  right: 20rpx;
  display: flex;
  gap: 20rpx;
  z-index: 100;
}

.action-btn {
  flex: 1;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;

  &.secondary {
    background: white;
    color: #4e5969;
    border: 2rpx solid #e5e6eb;
  }

  &.primary {
    background: linear-gradient(135deg, #165dff 0%, #4a90e2 100%);
    color: white;
  }

  &:active {
    transform: translateY(2rpx);
  }
}

.btn-text {
  color: inherit;
}
</style>
