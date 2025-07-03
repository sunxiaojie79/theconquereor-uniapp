<template>
	<view class="page">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<image class="bg-image" src="/static/bg/home-bg.jpg" mode="aspectFill"></image>
			<view class="user-info">
				<view class="user-header">
					<view class="user-avatar">
						<image :src="userInfo.avatar" mode="aspectFill"></image>
						<view class="notification-btn">
							<text class="icon">🔔</text>
							<view class="notification-dot"></view>
						</view>
					</view>
				</view>
				<view class="user-detail">
					<text class="nickname">{{ userInfo.nickname }}</text>
					<text class="level">{{ userLevel }}</text>
				</view>
			</view>
			
			<!-- 今日运动数据 -->
			<view class="today-sports">
				<view class="sports-item">
					<text class="label">今日运动</text>
					<text class="value">{{ todaySteps }} <text class="unit">步</text></text>
				</view>
				<view class="sports-item">
					<text class="label">约等于</text>
					<text class="value">{{ todayDistance }} <text class="unit">公里</text></text>
				</view>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-menu">
			<text class="section-title">快捷入口</text>
			<view class="menu-grid">
				<view class="menu-item" @click="navigateTo('/pages/challenge-square/index')">
					<view class="menu-icon primary">
						<text class="icon">🗺️</text>
					</view>
					<text class="menu-text">挑战广场</text>
				</view>
				<view class="menu-item" @click="navigateTo('/pages/profile/index')">
					<view class="menu-icon secondary">
						<text class="icon">👤</text>
					</view>
					<text class="menu-text">个人中心</text>
				</view>
				<view class="menu-item" @click="navigateTo('/pages/team-challenge/index')">
					<view class="menu-icon accent">
						<text class="icon">👥</text>
					</view>
					<text class="menu-text">我的队伍</text>
				</view>
				<view class="menu-item" @click="navigateTo('/pages/reward-store/index')">
					<view class="menu-icon purple">
						<text class="icon">🏆</text>
					</view>
					<text class="menu-text">成就勋章</text>
				</view>
			</view>
		</view>

		<!-- 进行中挑战 -->
		<view class="active-challenges">
			<text class="section-title">进行中挑战</text>
			<view class="challenge-list">
				<view 
					v-for="challenge in activeChallenges" 
					:key="challenge.challengeId"
					class="challenge-card"
					@click="navigateTo(`/pages/route-detail/index?id=${challenge.challengeId}`)"
				>
					<image class="challenge-image" :src="challenge.challenge.image" mode="aspectFill"></image>
					<view class="challenge-info">
						<view class="challenge-header">
							<text class="challenge-name">{{ challenge.challenge.name }}</text>
							<text class="challenge-progress">{{ challenge.progress }}%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" :style="{width: challenge.progress + '%'}"></view>
						</view>
						<view class="challenge-stats">
							<text class="stat-text">已完成 {{ challenge.currentDistance }}/{{ challenge.challenge.totalDistance }} 公里</text>
							<text class="stat-text">预计还需{{ calculateDaysLeft(challenge) }}天</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 如果没有进行中的挑战 -->
		<view v-if="activeChallenges.length === 0" class="no-challenges">
			<text class="no-challenges-text">暂无进行中的挑战</text>
			<button class="start-challenge-btn" @click="navigateTo('/pages/challenge-square/index')">
				开始挑战
			</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore, useChallengeStore } from '@/stores'

const userStore = useUserStore()
const challengeStore = useChallengeStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)
const userLevel = computed(() => userStore.userLevel)
const todaySteps = computed(() => userStore.todaySteps)
const todayDistance = computed(() => userStore.todayDistance)
const activeChallenges = computed(() => challengeStore.activeChallenges)

// 方法
const navigateTo = (url: string) => {
	// 判断是否为tabBar页面
	const tabBarPages = [
		'/pages/index/index',
		'/pages/challenge-square/index',
		'/pages/my-sports/index',
		'/pages/profile/index'
	]
	
	if (tabBarPages.includes(url)) {
		uni.switchTab({ url })
	} else {
		uni.navigateTo({ url })
	}
}

const calculateDaysLeft = (challenge: any) => {
	const currentDate = new Date()
	const finishDate = new Date(challenge.estimatedFinishDate)
	const timeDiff = finishDate.getTime() - currentDate.getTime()
	const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
	return daysDiff > 0 ? daysDiff : 0
}

onMounted(() => {
	// 页面加载时可以获取最新数据
	console.log('首页加载完成')
})
</script>

<style lang="scss" scoped>
.page {
	background-color: #F2F3F5;
	min-height: 100vh;
	padding: 20rpx;
}

.user-card {
	position: relative;
	height: 320rpx;
	margin-bottom: 30rpx;
	border-radius: 24rpx;
	overflow: hidden;
	background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0.4;
}

.user-info {
	position: relative;
	padding: 30rpx;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.user-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.user-avatar {
	position: relative;
	
	image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}
}

.notification-btn {
	position: absolute;
	top: -10rpx;
	right: -100rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	backdrop-filter: blur(10rpx);
	
	.icon {
		font-size: 32rpx;
		color: white;
	}
	
	.notification-dot {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #FF4757;
		border-radius: 50%;
	}
}

.user-detail {
	margin-top: 20rpx;
	
	.nickname {
		color: white;
		font-size: 32rpx;
		font-weight: 600;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.level {
		color: rgba(255, 255, 255, 0.8);
		font-size: 24rpx;
		display: block;
	}
}

.today-sports {
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10rpx);
	border-radius: 16rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
}

.sports-item {
	text-align: center;
	
	.label {
		color: white;
		font-size: 24rpx;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.value {
		color: white;
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		
		.unit {
			font-size: 24rpx;
			font-weight: normal;
			opacity: 0.8;
		}
	}
}

.quick-menu {
	background: white;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.section-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1D2129;
	display: block;
	margin-bottom: 30rpx;
}

.menu-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.menu-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	border-radius: 16rpx;
	transition: all 0.3s ease;
	
	&:active {
		background-color: #F2F3F5;
		transform: scale(0.95);
	}
}

.menu-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
	
	.icon {
		font-size: 36rpx;
	}
	
	&.primary {
		background-color: rgba(22, 93, 255, 0.1);
		.icon { color: #165DFF; }
	}
	
	&.secondary {
		background-color: rgba(255, 125, 0, 0.1);
		.icon { color: #FF7D00; }
	}
	
	&.accent {
		background-color: rgba(0, 180, 42, 0.1);
		.icon { color: #00B42A; }
	}
	
	&.purple {
		background-color: rgba(168, 85, 247, 0.1);
		.icon { color: #A855F7; }
	}
}

.menu-text {
	font-size: 24rpx;
	color: #1D2129;
	text-align: center;
}

.active-challenges {
	background: white;
	border-radius: 24rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.challenge-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.challenge-card {
	display: flex;
	background: #F2F3F5;
	border-radius: 16rpx;
	overflow: hidden;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
	}
}

.challenge-image {
	width: 96rpx;
	height: 96rpx;
	flex-shrink: 0;
}

.challenge-info {
	flex: 1;
	padding: 24rpx;
}

.challenge-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.challenge-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #1D2129;
}

.challenge-progress {
	font-size: 24rpx;
	color: #86909C;
}

.progress-bar {
	height: 8rpx;
	background-color: #E5E6EB;
	border-radius: 4rpx;
	overflow: hidden;
	margin-bottom: 16rpx;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #165DFF 0%, #4A90E2 100%);
	border-radius: 4rpx;
	transition: width 0.5s ease;
}

.challenge-stats {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.stat-text {
	font-size: 24rpx;
	color: #86909C;
}

.no-challenges {
	text-align: center;
	padding: 80rpx 40rpx;
	background: white;
	border-radius: 24rpx;
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.no-challenges-text {
	font-size: 28rpx;
	color: #86909C;
	margin-bottom: 40rpx;
	display: block;
}

.start-challenge-btn {
	background: linear-gradient(135deg, #165DFF 0%, #4A90E2 100%);
	color: white;
	border: none;
	border-radius: 50rpx;
	padding: 20rpx 60rpx;
	font-size: 32rpx;
	font-weight: 600;
	box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
	transition: all 0.3s ease;
	
	&:active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.3);
	}
}
</style>
