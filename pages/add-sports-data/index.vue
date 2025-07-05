<template>
  <view class="page">
    <view class="form-section">
      <!-- 公里数输入 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>公里数（km） </text>
        <input
          v-model="formData.distance"
          type="number"
          class="input"
          placeholder="请输入"
          placeholder-style="color: #C9CDD4;"
          @input="onDistanceInput"
        />
      </view>

      <!-- 时间选择 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>时间 </text>
        <picker
          mode="date"
          :value="formData.date"
          @change="onDateChange"
          class="date-picker"
        >
          <view class="picker-content">
            <text
              class="picker-text"
              :class="{ placeholder: !formData.dateDisplay }"
            >
              {{ formData.dateDisplay || "默认今天" }}
            </text>
            <image
              class="arrow-icon"
              src="/static/arrow-right-black.png"
              mode="aspectFill"
            ></image>
          </view>
        </picker>
      </view>

      <!-- 运动类型选择 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>运动类型 </text>
        <view class="picker-content" @click="showSportsTypeModal = true">
          <text
            class="picker-text"
            :class="{ placeholder: !formData.sportsType }"
          >
            {{ formData.sportsType || "默认第一个运动" }}
          </text>
          <image
            class="arrow-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 挑战项目选择 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>挑战项目 </text>
        <view class="picker-content" @click="showChallengeModal = true">
          <text
            class="picker-text"
            :class="{ placeholder: !formData.challenge }"
          >
            {{ formData.challenge || "默认一个挑战" }}
          </text>
          <image
            class="arrow-icon"
            src="/static/arrow-right-black.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 内容输入 -->
      <view class="form-item content-item">
        <text class="label">内容</text>
        <textarea
          v-model="formData.content"
          class="textarea"
          placeholder="请输入"
          placeholder-style="color: #C9CDD4;"
          :maxlength="500"
        />
      </view>

      <!-- 照片上传 -->
      <view class="form-item upload-item">
        <text class="label">照片（限1张）</text>
        <view class="upload-container">
          <view
            v-if="!formData.image"
            class="upload-placeholder"
            @click="chooseImage"
          >
            <text class="upload-icon">+</text>
            <text class="upload-text">上传照片</text>
          </view>
          <view v-else class="image-preview-container">
            <image
              :src="formData.image"
              mode="aspectFill"
              class="preview-image"
              @click="previewImage"
            ></image>
            <view class="delete-btn" @click="deleteImage">
              <text class="delete-text">✕</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 确认按钮 -->
    <view class="confirm-section">
      <button class="confirm-btn" @click="onSubmit">
        <text class="confirm-text">确认</text>
      </button>
    </view>

    <!-- 运动类型选择弹框 -->
    <view
      v-if="showSportsTypeModal"
      class="modal-overlay"
      @click="showSportsTypeModal = false"
    >
      <view class="modal" @click.stop>
        <view class="modal-options-container">
          <view
            v-for="option in sportsTypeOptions"
            :key="option.value"
            class="modal-option"
            :class="{ selected: formData.sportsType === option.label }"
            @click="selectSportsType(option)"
          >
            <text class="modal-option-text">{{ option.label }}</text>
          </view>
        </view>
        <view class="modal-cancel-container">
          <view class="modal-cancel" @click="showSportsTypeModal = false">
            <text class="modal-cancel-text">取消</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 挑战项目选择弹框 -->
    <view
      v-if="showChallengeModal"
      class="modal-overlay"
      @click="showChallengeModal = false"
    >
      <view class="modal" @click.stop>
        <view class="modal-options-container">
          <view
            v-for="option in challengeOptions"
            :key="option.value"
            class="modal-option"
            :class="{ selected: formData.challenge === option.label }"
            @click="selectChallenge(option)"
          >
            <text class="modal-option-text">{{ option.label }}</text>
          </view>
        </view>
        <view class="modal-cancel-container">
          <view class="modal-cancel" @click="showChallengeModal = false">
            <text class="modal-cancel-text">取消</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 响应式数据
const formData = ref({
  distance: "",
  date: "",
  dateDisplay: "",
  sportsType: "",
  challenge: "",
  content: "",
  image: "",
});

const showSportsTypeModal = ref(false);
const showChallengeModal = ref(false);

// 运动类型选项
const sportsTypeOptions = ref([
  { label: "游泳", value: "swimming" },
  { label: "骑行", value: "cycling" },
  { label: "步行", value: "walking" },
  { label: "室内步行", value: "indoor_walking" },
  { label: "跑步", value: "running" },
  { label: "室内跑步", value: "indoor_running" },
]);

// 挑战项目选项
const challengeOptions = ref([
  { label: "万里长城征途", value: "great_wall" },
  { label: "撒哈拉沙漠探索", value: "sahara" },
  { label: "亚马逊雨林冒险", value: "amazon" },
  { label: "丝绸之路重走", value: "silk_road" },
  { label: "喜马拉雅山脉挑战", value: "himalaya" },
  { label: "北极圈极地探险", value: "arctic" },
  { label: "马拉松环球挑战", value: "marathon" },
  { label: "古代商路探索", value: "ancient_route" },
]);

// 方法
const onDistanceInput = (event: any) => {
  const value = event.detail.value;
  // 限制只能输入数字和小数点
  const reg = /^\d*\.?\d*$/;
  if (reg.test(value)) {
    formData.value.distance = value;
  } else {
    // 如果输入非法字符，恢复到上一个有效值
    event.target.value = formData.value.distance;
  }
};

const onDateChange = (event: any) => {
  formData.value.date = event.detail.value;
  // 格式化日期显示
  const date = new Date(event.detail.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  formData.value.dateDisplay = `${year}.${month}.${day}`;
};

const selectSportsType = (option: any) => {
  formData.value.sportsType = option.label;
  showSportsTypeModal.value = false;
};

const selectChallenge = (option: any) => {
  formData.value.challenge = option.label;
  showChallengeModal.value = false;
};

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album"],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      formData.value.image = tempFilePath;
    },
    fail: (err) => {
      console.error("选择图片失败:", err);
    },
  });
};

const deleteImage = () => {
  formData.value.image = "";
};

const previewImage = () => {
  uni.previewImage({
    urls: [formData.value.image],
  });
};

const onSubmit = () => {
  // 验证必填项
  if (!formData.value.distance) {
    uni.showToast({
      title: "请输入公里数",
      icon: "none",
    });
    return;
  }

  if (!formData.value.date) {
    uni.showToast({
      title: "请选择时间",
      icon: "none",
    });
    return;
  }

  if (!formData.value.sportsType) {
    uni.showToast({
      title: "请选择运动类型",
      icon: "none",
    });
    return;
  }

  if (!formData.value.challenge) {
    uni.showToast({
      title: "请选择挑战项目",
      icon: "none",
    });
    return;
  }

  console.log("提交数据:", formData.value);

  uni.showToast({
    title: "提交成功",
    icon: "success",
  });

  // 延时返回上一页
  setTimeout(() => {
    uni.navigateBack();
  }, 1500);
};

// 初始化数据
const initFormData = () => {
  // 设置默认日期为今天
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  formData.value.date = `${year}-${month}-${day}`;
  formData.value.dateDisplay = `${year}.${month}.${day}`;

  // 设置默认运动类型
  formData.value.sportsType = sportsTypeOptions.value[0].label;

  // 设置默认挑战项目
  formData.value.challenge = challengeOptions.value[0].label;
};

onMounted(() => {
  console.log("添加运动数据页面加载完成");
  initFormData();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 200rpx;
}

/* 表单区域 */
.form-section {
  flex: 1;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.09);
  min-height: 112rpx;
  box-sizing: border-box;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  width: 260rpx;
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
  flex-shrink: 0;
}

.required {
  color: #ff4d4f;
  margin-right: 8rpx;
}

.input {
  flex: 1;
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
}

/* 选择器样式 */
.date-picker {
  flex: 1;
}

.picker-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-text {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 16rpx;

  &.placeholder {
    color: #c9cdd4;
  }
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
}

/* 内容输入项 */
.content-item {
  flex-direction: column;
  align-items: flex-start;
  padding-top: 32rpx;
  padding-bottom: 32rpx;
}

.textarea {
  width: 100%;
  min-height: 320rpx;
  font-size: 32rpx;
  color: rgba(0, 0, 0, 0.65);
  resize: none;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #f4f5f9;
  padding: 16rpx 24rpx;
  margin-top: 16rpx;
}

/* 上传项 */
.upload-item {
  flex-direction: column;
  align-items: flex-start;
  padding-top: 32rpx;
  padding-bottom: 32rpx;
}

.upload-container {
  position: relative;
}

.upload-placeholder {
  width: 160rpx;
  height: 160rpx;
  background-color: #f4f5f9;
  border-radius: 8rpx;
  border: 2rpx dashed #cccccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 16rpx;
}

.upload-icon {
  font-size: 48rpx;
  color: #999999;
}

.upload-text {
  font-size: 24rpx;
  color: #999999;
}

.image-preview-container {
  position: relative;
  width: 160rpx;
  height: 160rpx;
}

.preview-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #ffffff;
}

.delete-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
}

/* 底部确认按钮 */
.confirm-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom)) 32rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.09);
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }
}

.confirm-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}

/* 弹框样式 - 参考challenge-list页面 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0;
}

.modal {
  width: 100%;
  background: #f4f5f9;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  animation: slideUp 0.3s ease-out;
}

.modal-options-container {
  background: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  overflow: hidden;
}

.modal-option {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;
  text-align: center;

  &:last-child {
    border-bottom: none;
  }

  &.selected {
    background: #fff;

    .modal-option-text {
      color: #000;
      font-weight: 600;
    }
  }
}

.modal-option-text {
  font-size: 32rpx;
  color: #000;
}

.modal-cancel-container {
  background: #fff;
  overflow: hidden;
}

.modal-cancel {
  padding: 40rpx 30rpx;
  text-align: center;
}

.modal-cancel-text {
  font-size: 32rpx;
  color: #000;
  font-weight: 500;
}

/* 动画效果 */
@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
