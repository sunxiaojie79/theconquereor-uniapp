<template>
  <view class="page">

    <!-- 问题详情内容 -->
    <view class="content">
      <view class="question-section">
        <view class="question-header">
          <view class="question-icon">
            <text class="icon-text">问</text>
          </view>
          <text class="question-title">{{ questionData.question }}</text>
        </view>
      </view>
      
      <view class="answer-section">
        <text class="answer-content">{{ questionData.answer }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 问题数据
const questionData = ref({
  id: 0,
  question: '',
  answer: ''
})

// 所有FAQ数据
const allFaqData = [
  {
    id: 1,
    question: "如何开始我的第一个挑战？",
    answer: "在挑战广场选择适合的项目，点击加入挑战即可开始您的征程。建议新手先从简单的挑战开始，逐步提升难度。系统会根据您的运动能力推荐合适的挑战项目，确保安全有效的运动体验。"
  },
  {
    id: 2,
    question: "挑战口令是什么？如何使用？",
    answer: "挑战口令是特殊的邀请码，输入后可以解锁专属挑战或获得额外奖励。口令通常由官方或好友分享，在首页的挑战口令输入框中输入即可激活。有效的口令会给您带来意想不到的惊喜！"
  },
  {
    id: 3,
    question: "如何邀请朋友一起参加挑战？",
    answer: "在挑战详情页面点击邀请按钮，分享给您的朋友即可组队挑战。组队完成挑战会获得额外的团队奖励，还能增进友谊。您也可以创建自己的挑战团队，邀请更多朋友加入，一起享受运动的乐趣。"
  },
  {
    id: 4,
    question: "完成挑战后会获得什么奖励？",
    answer: "完成挑战将获得相应的勋章、积分和专属称号，还有机会获得实物奖励。不同难度的挑战奖励也不同，越困难的挑战奖励越丰富。您还可以在奖励商城用积分兑换心仪的商品。"
  },
  {
    id: 5,
    question: "如何查看我的挑战进度？",
    answer: "在个人中心或挑战详情页面都可以查看您的实时进度和历史记录。系统会自动记录您的运动数据，包括距离、时间、消耗的卡路里等。您也可以查看详细的运动轨迹和统计分析。"
  },
  {
    id: 6,
    question: "数据同步失败怎么办？",
    answer: "请检查网络连接，确保应用有网络权限。如问题持续，可在设置中手动同步数据或联系客服。我们建议在WiFi环境下进行数据同步，确保数据传输的稳定性和准确性。"
  },
  {
    id: 7,
    question: "如何更换头像和昵称？",
    answer: "在个人中心点击头像或昵称即可进行修改。修改后的信息会在下次登录时生效。您可以上传自己喜欢的照片作为头像，也可以选择系统提供的默认头像。昵称需要符合社区规范要求。"
  },
  {
    id: 8,
    question: "运动数据不准确怎么办？",
    answer: "请确保手机传感器正常工作，保持手机贴身携带。也可在设置中校准传感器或手动调整数据。建议将手机放在贴身口袋或使用运动手环等设备，以获得更准确的运动数据记录。"
  },
  {
    id: 9,
    question: "如何加入或退出团队？",
    answer: "在团队页面可以搜索并申请加入团队，或在个人设置中退出当前团队。退出团队不会影响个人数据。每个团队都有自己的特色和目标，选择适合自己的团队能让运动更有动力。"
  },
  {
    id: 10,
    question: "忘记密码如何找回？",
    answer: "在登录页面点击忘记密码，通过绑定的手机号或邮箱重置密码。建议绑定多种方式确保账号安全。为了保护您的账号安全，我们建议定期更换密码，并启用两步验证功能。"
  },
  {
    id: 11,
    question: "应用闪退或卡顿怎么办？",
    answer: "尝试重启应用或清理缓存。如果问题持续，请检查手机存储空间并更新到最新版本。建议保持手机有足够的存储空间，定期清理不必要的文件，确保应用运行流畅。"
  },
  {
    id: 12,
    question: "如何关闭推送通知？",
    answer: "在应用设置中可以选择性关闭各类推送通知，也可在手机系统设置中统一管理应用通知权限。您可以根据自己的需要选择接收哪些类型的通知，比如挑战提醒、好友邀请等。"
  }
]

// 默认显示第一个问题
questionData.value = allFaqData[0]

// 返回上一页
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  background: #3c3c43;
  padding-top: var(--status-bar-height, 44rpx);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.navbar-left {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
}

.back-icon {
  color: #fff;
  font-size: 48rpx;
  font-weight: normal;
  line-height: 1;
}

.navbar-center {
  flex: 1;
  text-align: center;
}

.navbar-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: 500;
}

.navbar-right {
  display: flex;
  gap: 15rpx;
}

.nav-icon-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.target-btn {
    background: rgba(255, 255, 255, 0.2);
  }
}

.nav-icon {
  color: #fff;
  font-size: 28rpx;
}

/* 内容区域 */
.content {
  background: #fff;
  // margin-top: calc(var(--status-bar-height, 44rpx) + 88rpx);
  min-height: calc(100vh - var(--status-bar-height, 44rpx) - 88rpx);
  padding: 40rpx 30rpx;
}

.question-section {
  margin-bottom: 60rpx;
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.question-icon {
  width: 60rpx;
  height: 60rpx;
  background: #FFD700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 6rpx;
}

.icon-text {
  color: #333;
  font-size: 28rpx;
  font-weight: 600;
}

.question-title {
  flex: 1;
  color: #333;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 8rpx;
}

.answer-section {
  background-color:#F4F5F9;
  border-radius: 20rpx;
  padding: 20rpx;
}

.answer-content {
  color: #666;
  font-size: 32rpx;
  line-height: 1.8;
  letter-spacing: 0.5rpx;
  text-align: justify;
}
</style> 