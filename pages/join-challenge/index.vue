<template>
  <view class="page">
    <!-- 绑定挑战CODE区域 -->
    <view class="challenge-code-section">
      <text class="section-title">绑定挑战CODE</text>
      <view class="input-area">
        <input
          class="code-input"
          placeholder="填写你的挑战code"
          placeholder-style="color: #999;"
          v-model="challengeCode"
        />
        <view class="submit-btn" @click="bindChallengeCode">
          <text class="arrow">→</text>
        </view>
      </view>
    </view>
    <view class="my-challenge-code-section">
      <view class="section-title-row">
        <text class="section-title">未开始的挑战</text>
        <view class="section-action-btn" @click="showSaveChallengeDialog">
          <text class="section-action">保存挑战</text>
        </view>
      </view>
      <view
        class="challenge-code-list"
        v-if="
          challengeCodeList.filter((item: any) => Number(item.status) === 2)
            .length > 0
        "
      >
        <view
          v-for="(item, index) in challengeCodeList.filter(
            (item: any) => Number(item.status) === 2
          )"
          :key="item.id"
          class="challenge-code-item"
        >
          <view class="challenge-info">
            <image
              class="challenge-avatar"
              :src="item.avatar"
              mode="aspectFill"
            ></image>
            <view class="challenge-info-right">
              <text class="challenge-name">{{ item.challengeTitle }}</text>
              <text class="bind-date">绑定日期：{{ item.createTime }}</text>
            </view>
          </view>

          <view class="code-row">
            <image
              class="key-icon"
              src="/static/key.png"
              mode="aspectFill"
            ></image>
            <text class="challenge-code">{{ item.code }}</text>
            <view class="start-btn" @click="startChallenge(item.code)">
              <text class="copy-text">开始挑战</text>
            </view>
          </view>
        </view>
      </view>
      <view class="no-data" v-else>
        <text class="no-data-text">暂无未开始的挑战</text>
      </view>
    </view>
    <view class="my-challenge-code-section">
      <view class="section-title-row">
        <text class="section-title">已开始的挑战</text>
      </view>
      <view
        class="challenge-code-list"
        v-if="
          challengeCodeList.filter((item: any) => Number(item.status) === 3)
            .length > 0
        "
      >
        <view
          v-for="(item, index) in challengeCodeList.filter(
            (item: any) => Number(item.status) === 3
          )"
          :key="item.id"
          class="challenge-code-item"
        >
          <view class="challenge-info">
            <image
              class="challenge-avatar"
              :src="item.avatar"
              mode="aspectFill"
            ></image>
            <view class="challenge-info-right">
              <text class="challenge-name">{{ item.challengeTitle }}</text>
              <text class="bind-date">绑定日期：{{ item.createTime }}</text>
            </view>
          </view>

          <view class="code-row">
            <image
              class="key-icon"
              src="/static/key.png"
              mode="aspectFill"
            ></image>
            <text class="challenge-code">{{ item.code }}</text>
            <view class="copy-btn" @click="copyCode(item.code)">
              <text class="copy-text">复制</text>
            </view>
          </view>
        </view>
      </view>
      <view class="no-data" v-else>
        <text class="no-data-text">暂无已开始的挑战</text>
      </view>
    </view>
    <!-- 挑战码弹框 -->
    <ChallengeCodeDialog
      v-model:visible="dialogVisible"
      @confirm="handleSaveChallenge"
      @cancel="handleCancelSave"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { baseurl } from "@/config/dev.env";
import ChallengeCodeDialog from "@/components/ChallengeCodeDialog.vue";

// 响应式数据
const challengeCode = ref("");
const challengeCodeList = ref([]);
const dialogVisible = ref(false);

// 绑定挑战CODE
const bindChallengeCode = async () => {
  if (!challengeCode.value.trim()) {
    uni.showToast({
      title: "请输入挑战CODE",
      icon: "none",
    });
    return;
  }
  console.log(
    "🚀 ~ bindChallengeCode ~ challengeCode.value:",
    challengeCode.value
  );
  const res = await uni.request({
    url: baseurl + `/wx/app/bind/${challengeCode.value}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  uni.showLoading({
    title: "绑定中...",
  });
  console.log("🚀 ~ bindChallengeCode ~ res:", res);
  if ((res.data as any).code === 200) {
    uni.showToast({
      title: "绑定成功",
      icon: "success",
    });
    initChallengeCodeList();
  } else {
    uni.showToast({
      title: "绑定失败",
      icon: "error",
    });
  }

  setTimeout(() => {
    uni.hideLoading();
    challengeCode.value = "";
  }, 1000);
};
//
// 开始挑战
const startChallenge = async (code: string) => {
  const res: any = await uni.request({
    url: baseurl + `/wx/app/start/${code}`,
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  if (res.data.code === 200) {
    uni.showToast({
      title: "开始挑战成功",
      icon: "success",
    });
    initChallengeCodeList();
  } else {
    uni.showToast({
      title: "开始挑战失败",
      icon: "none",
    });
  }
};

// 复制CODE
const copyCode = (code: string) => {
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
    fail: () => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
    },
  });
};

// 初始化数据
const initChallengeCodeList = async () => {
  const res: any = await uni.request({
    url: baseurl + "/wx/app/my/challengeProject",
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
  console.log("🚀 ~ initChallengeCodeList ~ res:", res);
  if (res.data.code === 200) {
    challengeCodeList.value = res.data.data;
  }
};

// 显示保存挑战弹框
const showSaveChallengeDialog = () => {
  dialogVisible.value = true;
};

// 处理保存挑战
const handleSaveChallenge = async (code: string) => {
  challengeCode.value = code;
  bindChallengeCode();
};

// 处理取消保存
const handleCancelSave = () => {
  console.log("取消保存挑战");
};

onMounted(() => {
  initChallengeCodeList();
  console.log("加入挑战页面加载完成");
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  min-height: 100vh;
  padding: 32rpx;
}

/* 绑定挑战CODE区域 */
.challenge-code-section {
  height: 192rpx;
  width: 686rpx;
  margin-bottom: 40rpx;
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

/* 我的挑战CODE */
.my-challenge-code-section {
  margin-bottom: 50rpx;
  .section-title {
    color: #333;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 24rpx;
    display: block;
  }
  .section-title-row {
    display: flex;
    justify-content: space-between;

    .section-action-btn {
      width: 150rpx;
      height: 60rpx;
      background: #fadb47;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .section-action {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
      }
    }
  }
}

.challenge-code-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.challenge-code-item {
  width: 686rpx;
  height: 256rpx;
  padding: 24rpx 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.09);
}

.challenge-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.challenge-info {
  width: 686rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
}

.challenge-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.challenge-name {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.bind-date {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
}

.code-row {
  width: 686rpx;
  height: 88rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 8rpx;
  background: #f4f5f9;
  margin-top: 24rpx;
}

.key-icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 20rpx;
}

.challenge-code {
  flex: 1;
  font-size: 24rpx;
  color: #242a36;
  margin-right: 16rpx;
}

.copy-btn {
  width: 80rpx;
  height: 50rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.45);
}

.copy-text {
  font-size: 24rpx;
  color: #242a36;
}
.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100rpx 0;
}
.start-btn {
  width: 120rpx;
  height: 50rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.45);
}
</style>
