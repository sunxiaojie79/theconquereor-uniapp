<template>
  <view class="challenge-code-dialog" v-if="visible" @click="handleMaskClick">
    <!-- 遮罩层 -->
    <view class="mask" :class="{ 'mask-show': showAnimation }"></view>

    <!-- 弹框内容 -->
    <view
      class="dialog-content"
      :class="{ 'dialog-show': showAnimation }"
      @click.stop
    >
      <!-- 标题 -->
      <view class="dialog-title"> 保存挑战 </view>

      <!-- 输入框 -->
      <view class="dialog-input-area">
        <input
          class="challenge-input"
          type="text"
          placeholder="请输入挑战码"
          placeholder-style="color: #999;"
          v-model="inputValue"
          @input="handleInput"
        />
      </view>

      <!-- 按钮组 -->
      <view class="dialog-buttons">
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
        <button
          class="btn btn-confirm"
          @click="handleConfirm"
          :disabled="!inputValue.trim()"
        >
          确认
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

// Props 定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  maskClickable: {
    type: Boolean,
    default: true,
  },
});

// Events 定义
const emit = defineEmits(["confirm", "cancel", "update:visible"]);

// 响应式数据
const showAnimation = ref(false);
const inputValue = ref("");

// 监听 visible 变化，控制动画
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        showAnimation.value = true;
      });
    } else {
      showAnimation.value = false;
      // 关闭时清空输入
      inputValue.value = "";
    }
  }
);

// 处理输入
const handleInput = (e) => {
  inputValue.value = e.detail.value;
};

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.maskClickable) {
    handleCancel();
  }
};

// 处理取消
const handleCancel = () => {
  showAnimation.value = false;
  setTimeout(() => {
    emit("update:visible", false);
    emit("cancel");
  }, 200);
};

// 处理确认
const handleConfirm = () => {
  if (!inputValue.value.trim()) {
    uni.showToast({
      title: "请输入挑战码",
      icon: "none",
    });
    return;
  }

  showAnimation.value = false;
  setTimeout(() => {
    emit("update:visible", false);
    emit("confirm", inputValue.value.trim());
  }, 200);
};
</script>

<style lang="scss" scoped>
.challenge-code-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.2s ease;
}

.mask-show {
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  background: #ffffff;
  border-radius: 16rpx;
  width: 600rpx;
  max-width: 90%;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
  transform: scale(0.7);
  opacity: 0;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.dialog-show {
  transform: scale(1);
  opacity: 1;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  text-align: center;
  padding: 48rpx 40rpx 24rpx;
  line-height: 1.4;
}

.dialog-input-area {
  padding: 0 40rpx 32rpx;
}

.challenge-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
  background: #fff;
}

.challenge-input:focus {
  border-color: #fadb47;
}

.dialog-buttons {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.btn {
  flex: 1;
  height: 100rpx;
  border: none;
  background: transparent;
  font-size: 32rpx;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  position: relative;
}

.btn::after {
  border: none;
}

.btn-cancel {
  color: #666666;
  border-right: 1rpx solid #f0f0f0;
  border-radius: 0 0 0 16rpx;
}

.btn-cancel:active {
  background-color: #f5f5f5;
}

.btn-confirm {
  color: #fadb47;
  font-weight: 600;
  border-radius: 0 0 16rpx 0;
}

.btn-confirm:disabled {
  color: #ccc;
}

.btn-confirm:not(:disabled):active {
  background-color: #fff9e6;
}
</style>
