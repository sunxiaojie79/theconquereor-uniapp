<template>
  <view class="page">

    <!-- 问题列表 -->
    <view class="faq-content">
      <view class="faq-list">
        <view
          v-for="faq in faqList"
          :key="faq.id"
          class="faq-item"
          @click="handleFaqClick(faq.id)"
        >
          <text class="faq-question">{{ faq.question }}</text>
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// FAQ数据
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
  {
    id: 6,
    question: "数据同步失败怎么办？",
    answer:
      "请检查网络连接，确保应用有网络权限。如问题持续，可在设置中手动同步数据或联系客服。",
  },
  {
    id: 7,
    question: "如何更换头像和昵称？",
    answer:
      "在个人中心点击头像或昵称即可进行修改。修改后的信息会在下次登录时生效。",
  },
  {
    id: 8,
    question: "运动数据不准确怎么办？",
    answer:
      "请确保手机传感器正常工作，保持手机贴身携带。也可在设置中校准传感器或手动调整数据。",
  },
  {
    id: 9,
    question: "如何加入或退出团队？",
    answer:
      "在团队页面可以搜索并申请加入团队，或在个人设置中退出当前团队。退出团队不会影响个人数据。",
  },
  {
    id: 10,
    question: "忘记密码如何找回？",
    answer:
      "在登录页面点击忘记密码，通过绑定的手机号或邮箱重置密码。建议绑定多种方式确保账号安全。",
  },
  {
    id: 11,
    question: "应用闪退或卡顿怎么办？",
    answer:
      "尝试重启应用或清理缓存。如果问题持续，请检查手机存储空间并更新到最新版本。",
  },
  {
    id: 12,
    question: "如何关闭推送通知？",
    answer:
      "在应用设置中可以选择性关闭各类推送通知，也可在手机系统设置中统一管理应用通知权限。",
  },
]);

// 方法
const goBack = () => {
  // 尝试返回上一页，如果失败则跳转到首页
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }
};

const handleFaqClick = (faqId: number) => {
  const selectedFaq = faqList.value.find((faq) => faq.id === faqId);
  if (selectedFaq) {
    uni.showModal({
      title: selectedFaq.question,
      content: selectedFaq.answer,
      showCancel: false,
      confirmText: "我知道了",
    });
  }
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 自定义导航栏 */
.custom-navbar {
  background: #242a36;
  padding-top: var(--status-bar-height, 44rpx);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.navbar-content {
  height: 120rpx;
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
}

.nav-icon {
  font-size: 28rpx;
}

/* 内容区域 */
.faq-content {
  background: #fff;
  // margin-top: calc(var(--status-bar-height, 44rpx) + 88rpx);
  min-height: calc(100vh - var(--status-bar-height, 44rpx) - 88rpx);
}

.faq-list {
  padding: 0;
  padding-bottom: 40rpx;
}

.faq-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 48rpx 30rpx;
  border-bottom: 1rpx solid #e8e8e8;
  background: #fff;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
}

.faq-question {
  color: #333;
  font-size: 32rpx;
  line-height: 1.5;
  flex: 1;
  margin-right: 20rpx;
}

.arrow-icon {
  color: #999;
  font-size: 32rpx;
  font-weight: normal;
}
</style>
