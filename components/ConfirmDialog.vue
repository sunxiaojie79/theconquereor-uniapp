<template>
  <view class="confirm-dialog" v-if="visible" @click="handleMaskClick">
    <!-- 遮罩层 -->
    <view class="mask" :class="{ 'mask-show': showAnimation }"></view>
    
    <!-- 弹框内容 -->
    <view class="dialog-content" :class="{ 'dialog-show': showAnimation }" @click.stop>
      <!-- 标题 -->
      <view class="dialog-title" v-if="title">
        {{ title }}
      </view>
      
      <!-- 内容 -->
      <view class="dialog-message">
        {{ message }}
      </view>
      
      <!-- 按钮组 -->
      <view class="dialog-buttons">
        <button class="btn btn-cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn btn-confirm" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

// Props 定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  maskClickable: {
    type: Boolean,
    default: true
  }
})

// Events 定义
const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

// 响应式数据
const showAnimation = ref(false)

// 监听 visible 变化，控制动画
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      showAnimation.value = true
    })
  } else {
    showAnimation.value = false
  }
})

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.maskClickable) {
    handleCancel()
  }
}

// 处理取消
const handleCancel = () => {
  showAnimation.value = false
  setTimeout(() => {
    emit('update:visible', false)
    emit('cancel')
  }, 200)
}

// 处理确认
const handleConfirm = () => {
  showAnimation.value = false
  setTimeout(() => {
    emit('update:visible', false)
    emit('confirm')
  }, 200)
}
</script>

<style lang="scss" scoped>
.confirm-dialog {
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
  padding: 48rpx 40rpx 0;
  line-height: 1.4;
}

.dialog-message {
  font-size: 32rpx;
  color: #666666;
  text-align: center;
  padding: 32rpx 40rpx 48rpx;
  line-height: 1.5;
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
  color: #ff4757;
  font-weight: 600;
  border-radius: 0 0 16rpx 0;
}

.btn-confirm:active {
  background-color: #fff2f2;
}
</style> 