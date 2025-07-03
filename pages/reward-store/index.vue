<template>
  <view class="page">
    <!-- 我的积分卡片 -->
    <view class="points-card">
      <view class="points-header">
        <view class="points-info">
          <text class="points-title">我的积分</text>
          <text class="points-count">{{ userPoints }}</text>
        </view>
        <view class="points-icon">🏆</view>
      </view>
      <view class="points-tips">
        <text class="tips-text">完成挑战和运动任务可获得积分</text>
      </view>
    </view>

    <!-- 奖励分类 -->
    <view class="category-tabs">
      <view 
        v-for="(category, index) in categories" 
        :key="index"
        class="category-tab"
        :class="{ active: selectedCategory === index }"
        @click="selectedCategory = index"
      >
        <text class="category-icon">{{ category.icon }}</text>
        <text class="category-text">{{ category.name }}</text>
      </view>
    </view>

    <!-- 奖励列表 -->
    <view class="rewards-grid">
      <view 
        v-for="reward in filteredRewards" 
        :key="reward.id"
        class="reward-item"
        @click="viewRewardDetail(reward)"
      >
        <view class="reward-image-container">
          <image :src="reward.image" mode="aspectFill" class="reward-image"></image>
          <view v-if="reward.isLimited" class="limited-badge">限量</view>
          <view v-if="reward.isHot" class="hot-badge">热门</view>
        </view>
        
        <view class="reward-info">
          <text class="reward-name">{{ reward.name }}</text>
          <text class="reward-desc">{{ reward.description }}</text>
          
          <view class="reward-footer">
            <view class="reward-points">
              <text class="points-icon">🏆</text>
              <text class="points-value">{{ reward.points }}积分</text>
            </view>
            
            <view class="reward-stock" v-if="reward.stock !== undefined">
              <text class="stock-text">库存{{ reward.stock }}</text>
            </view>
          </view>
          
          <button 
            class="exchange-btn"
            :class="{ 
              disabled: userPoints < reward.points || reward.stock === 0,
              exchanged: reward.isExchanged
            }"
            @click.stop="exchangeReward(reward)"
          >
            <text v-if="reward.isExchanged">已兑换</text>
            <text v-else-if="userPoints < reward.points">积分不足</text>
            <text v-else-if="reward.stock === 0">已售罄</text>
            <text v-else>兑换</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 我的兑换记录 -->
    <view class="exchange-history">
      <view class="section-header">
        <text class="section-title">兑换记录</text>
        <text class="view-all" @click="viewAllHistory">查看全部</text>
      </view>
      
      <view class="history-list">
        <view 
          v-for="record in recentExchanges" 
          :key="record.id"
          class="history-item"
        >
          <image :src="record.image" mode="aspectFill" class="history-image"></image>
          <view class="history-info">
            <text class="history-name">{{ record.name }}</text>
            <text class="history-time">{{ formatTime(record.exchangeTime) }}</text>
          </view>
          <view class="history-status" :class="record.status">
            <text class="status-text">{{ getStatusText(record.status) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 奖励详情弹窗 -->
    <view v-if="showRewardDetail" class="popup-overlay" @click="showRewardDetail = false">
      <view class="reward-detail-popup" @click.stop>
        <view class="detail-header">
          <text class="detail-close" @click="showRewardDetail = false">✕</text>
        </view>
        
        <view class="detail-content" v-if="selectedReward">
          <image :src="selectedReward.image" mode="aspectFill" class="detail-image"></image>
          
          <view class="detail-info">
            <text class="detail-name">{{ selectedReward.name }}</text>
            <text class="detail-desc">{{ selectedReward.fullDescription }}</text>
            
            <view class="detail-features" v-if="selectedReward.features">
              <text class="features-title">商品特色</text>
              <view class="features-list">
                <text 
                  v-for="feature in selectedReward.features" 
                  :key="feature"
                  class="feature-item"
                >
                  • {{ feature }}
                </text>
              </view>
            </view>
            
            <view class="detail-footer">
              <view class="detail-points">
                <text class="points-icon">🏆</text>
                <text class="points-value">{{ selectedReward.points }}积分</text>
              </view>
              
              <button 
                class="detail-exchange-btn"
                :class="{ 
                  disabled: userPoints < selectedReward.points || selectedReward.stock === 0,
                  exchanged: selectedReward.isExchanged
                }"
                @click="exchangeReward(selectedReward)"
              >
                <text v-if="selectedReward.isExchanged">已兑换</text>
                <text v-else-if="userPoints < selectedReward.points">积分不足</text>
                <text v-else-if="selectedReward.stock === 0">已售罄</text>
                <text v-else>立即兑换</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores'

const userStore = useUserStore()

// 响应式数据
const selectedCategory = ref(0)
const showRewardDetail = ref(false)
const selectedReward = ref<any>(null)

// 奖励分类
const categories = [
  { name: '全部', icon: '🎁' },
  { name: '实物奖励', icon: '📦' },
  { name: '数字奖励', icon: '💎' },
  { name: '运动装备', icon: '👟' },
  { name: '健康食品', icon: '🥗' }
]

// 模拟奖励数据
const rewards = ref([
  {
    id: '1',
    name: '丝绸之路纪念奖牌',
    description: '完成丝绸之路挑战专属奖牌',
    fullDescription: '高品质合金制作，精美包装，专为挑战者定制的纪念奖牌。直径6cm，厚度3mm，附带精美包装盒和证书。',
    image: '/static/rewards/silk-road-medal.png',
    points: 500,
    category: 'physical',
    stock: 15,
    isLimited: true,
    isHot: true,
    isExchanged: false,
    features: ['高品质合金材质', '精美包装盒', '个人定制刻字', '官方认证证书']
  },
  {
    id: '2', 
    name: '长城挑战徽章',
    description: '万里长城挑战完成徽章',
    fullDescription: '精致的长城主题徽章，采用景泰蓝工艺制作，色彩鲜艳，寓意深刻。',
    image: '/static/rewards/great-wall-badge.png',
    points: 300,
    category: 'physical',
    stock: 25,
    isLimited: false,
    isHot: true,
    isExchanged: false,
    features: ['景泰蓝工艺', '防氧化涂层', '别针固定', '收藏价值高']
  },
  {
    id: '3',
    name: '敦煌文化数字藏品',
    description: '限量版敦煌艺术数字藏品',
    fullDescription: '基于区块链技术的数字藏品，包含敦煌莫高窟精美壁画元素，具有唯一性和收藏价值。',
    image: '/static/rewards/dunhuang-cultural.png',
    points: 200,
    category: 'digital',
    stock: 100,
    isLimited: true,
    isHot: false,
    isExchanged: false,
    features: ['区块链认证', '唯一性保证', '高清画质', '永久收藏']
  },
  {
    id: '4',
    name: '专业运动水壶',
    description: '保温保冷运动水壶500ml',
    fullDescription: '304不锈钢材质，双层真空保温，24小时保温保冷，人体工学设计，运动必备。',
    image: '/static/logo.png',
    points: 150,
    category: 'equipment',
    stock: 50,
    isLimited: false,
    isHot: false,
    isExchanged: false,
    features: ['304不锈钢', '24小时保温', '防漏设计', '人体工学']
  },
  {
    id: '5',
    name: '蛋白质补充包',
    description: '高品质乳清蛋白粉500g',
    fullDescription: '进口乳清蛋白，高纯度，易吸收，运动后补充的最佳选择。',
    image: '/static/logo.png',
    points: 180,
    category: 'health',
    stock: 30,
    isLimited: false,
    isHot: false,
    isExchanged: false,
    features: ['进口原料', '高蛋白含量', '易溶解', '无添加剂']
  }
])

// 兑换记录
const recentExchanges = ref([
  {
    id: '1',
    name: '长城挑战徽章',
    image: '/static/rewards/great-wall-badge.png',
    exchangeTime: '2024-01-15',
    status: 'shipped'
  },
  {
    id: '2',
    name: '敦煌文化数字藏品',
    image: '/static/rewards/dunhuang-cultural.png',
    exchangeTime: '2024-01-10',
    status: 'completed'
  }
])

// 计算属性
const userPoints = computed(() => userStore.userInfo.points || 0)

const filteredRewards = computed(() => {
  if (selectedCategory.value === 0) {
    return rewards.value
  }
  
  const categoryMap: Record<number, string> = {
    1: 'physical',
    2: 'digital', 
    3: 'equipment',
    4: 'health'
  }
  
  const categoryType = categoryMap[selectedCategory.value]
  return rewards.value.filter(reward => reward.category === categoryType)
})

// 方法
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '处理中',
    'shipped': '已发货',
    'completed': '已完成'
  }
  return statusMap[status] || status
}

const viewRewardDetail = (reward: any) => {
  selectedReward.value = reward
  showRewardDetail.value = true
}

const exchangeReward = (reward: any) => {
  if (reward.isExchanged) {
    uni.showToast({
      title: '该商品已兑换',
      icon: 'none'
    })
    return
  }

  if (userPoints.value < reward.points) {
    uni.showToast({
      title: '积分不足',
      icon: 'none'
    })
    return
  }

  if (reward.stock === 0) {
    uni.showToast({
      title: '商品已售罄',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '确认兑换',
    content: `确定要花费${reward.points}积分兑换${reward.name}吗？`,
    success: (res: any) => {
      if (res.confirm) {
        // 扣除积分
        userStore.userInfo.points -= reward.points
        // 减少库存
        reward.stock -= 1
        // 标记为已兑换
        reward.isExchanged = true
        
        uni.showToast({
          title: '兑换成功！',
          icon: 'success'
        })
        
        showRewardDetail.value = false
      }
    }
  })
}

const viewAllHistory = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  console.log('奖励商城页面加载完成')
})
</script>

<style lang="scss" scoped>
.page {
  background-color: #F2F3F5;
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.points-card {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  color: white;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.points-info {
  flex: 1;
}

.points-title {
  font-size: 28rpx;
  opacity: 0.9;
  display: block;
  margin-bottom: 8rpx;
}

.points-count {
  font-size: 48rpx;
  font-weight: bold;
}

.points-icon {
  font-size: 60rpx;
}

.points-tips {
  .tips-text {
    font-size: 24rpx;
    opacity: 0.8;
  }
}

.category-tabs {
  display: flex;
  background: white;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.category-tab {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  min-width: 120rpx;
  
  &.active {
    background: #165DFF;
    
    .category-icon, .category-text {
      color: white;
    }
  }
}

.category-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.category-text {
  font-size: 24rpx;
  color: #86909C;
  font-weight: 500;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.reward-item {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.reward-image-container {
  position: relative;
  width: 100%;
  height: 200rpx;
}

.reward-image {
  width: 100%;
  height: 100%;
}

.limited-badge, .hot-badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  color: white;
  font-weight: 600;
}

.limited-badge {
  background: #FF4757;
}

.hot-badge {
  background: #FFA726;
}

.reward-info {
  padding: 20rpx;
}

.reward-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.3;
}

.reward-desc {
  font-size: 24rpx;
  color: #86909C;
  line-height: 1.4;
  display: block;
  margin-bottom: 16rpx;
}

.reward-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.reward-points {
  display: flex;
  align-items: center;
  
  .points-icon {
    font-size: 20rpx;
    margin-right: 4rpx;
  }
  
  .points-value {
    font-size: 24rpx;
    font-weight: 600;
    color: #FF6B35;
  }
}

.reward-stock {
  .stock-text {
    font-size: 20rpx;
    color: #86909C;
  }
}

.exchange-btn {
  width: 100%;
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.disabled {
    background: #E5E6EB;
    color: #86909C;
  }
  
  &.exchanged {
    background: #00B42A;
  }
  
  &:not(.disabled):active {
    transform: translateY(1rpx);
  }
}

.exchange-history {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1D2129;
}

.view-all {
  font-size: 24rpx;
  color: #165DFF;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F2F3F5;
  border-radius: 16rpx;
}

.history-image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  margin-right: 16rpx;
}

.history-info {
  flex: 1;
}

.history-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 4rpx;
}

.history-time {
  font-size: 24rpx;
  color: #86909C;
}

.history-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  
  &.pending {
    background: rgba(255, 193, 7, 0.1);
    
    .status-text {
      color: #FFC107;
    }
  }
  
  &.shipped {
    background: rgba(22, 93, 255, 0.1);
    
    .status-text {
      color: #165DFF;
    }
  }
  
  &.completed {
    background: rgba(0, 180, 42, 0.1);
    
    .status-text {
      color: #00B42A;
    }
  }
}

.status-text {
  font-size: 24rpx;
  font-weight: 500;
}

// 弹窗样式
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.reward-detail-popup {
  background: white;
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx 0;
}

.detail-close {
  font-size: 40rpx;
  color: #86909C;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-content {
  padding: 0 30rpx 30rpx;
}

.detail-image {
  width: 100%;
  height: 300rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.detail-info {
  
}

.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 16rpx;
}

.detail-desc {
  font-size: 28rpx;
  color: #4E5969;
  line-height: 1.5;
  display: block;
  margin-bottom: 24rpx;
}

.detail-features {
  margin-bottom: 30rpx;
}

.features-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 16rpx;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.feature-item {
  font-size: 26rpx;
  color: #4E5969;
  line-height: 1.4;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1rpx solid #E5E6EB;
}

.detail-points {
  display: flex;
  align-items: center;
  
  .points-icon {
    font-size: 24rpx;
    margin-right: 8rpx;
  }
  
  .points-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #FF6B35;
  }
}

.detail-exchange-btn {
  background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  
  &.disabled {
    background: #E5E6EB;
    color: #86909C;
  }
  
  &.exchanged {
    background: #00B42A;
  }
}
</style> 