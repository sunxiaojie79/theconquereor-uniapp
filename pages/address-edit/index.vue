<template>
  <view class="page">
    <!-- 表单区域 -->
    <view class="form-section">
      <!-- 收件人 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>收件人 </text>
        <input
          class="input"
          v-model="formData.receiverName"
          placeholder="请输入收件人"
          placeholder-style="color: #C9CDD4;"
        />
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>手机号 </text>
        <input
          class="input"
          v-model="formData.contact"
          placeholder="请输入手机号"
          placeholder-style="color: #C9CDD4;"
          type="number"
        />
      </view>

      <!-- 所属地区 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>所属地区 </text>
        <picker
          mode="region"
          :value="formData.region"
          @change="onRegionChange"
          class="region-picker"
        >
          <view class="picker-content">
            <text class="picker-text" :class="{ placeholder: !regionText }">
              {{ regionText || "请选择地区" }}
            </text>
            <image
              class="arrow-icon"
              src="/static/arrow-right-black.png"
              mode="aspectFill"
            ></image>
          </view>
        </picker>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <text class="label"> <text class="required">*</text>详细地址 </text>
        <input
          class="input"
          v-model="formData.address"
          placeholder="请输入详细地址"
          placeholder-style="color: #C9CDD4;"
        />
      </view>

      <!-- 设为默认地址 -->
      <view class="form-item switch-item">
        <text class="label">设为默认地址</text>
        <switch
          :checked="formData.defaultFlag"
          @change="onSwitchChange"
          color="#FADB47"
          class="address-switch"
        />
      </view>
    </view>

    <!-- 底部确认按钮 -->
    <view class="confirm-section">
      <button class="confirm-btn" @click="handleConfirm">
        <text class="confirm-text">确认</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// 表单数据
const formData = ref({
  receiverName: "",
  contact: "",
  region: [],
  address: "",
  defaultFlag: true,
});

// 计算地区显示文字
const regionText = computed(() => {
  if (formData.value.region.length === 0) {
    return "";
  }
  return formData.value.region.join("");
});

// 页面参数
const addressId = ref("");
const isEdit = ref(false);

// 方法
const onRegionChange = (e: any) => {
  console.log("🚀 ~ onRegionChange ~ e:", e);
  formData.value.region = e.detail.value;
  console.log("选择地区:", e.detail.value);
};

const onSwitchChange = (e: any) => {
  console.log("🚀 ~ onSwitchChange ~ e:", e);
  formData.value.defaultFlag = e.detail.value;
  console.log("设为默认地址:", e.detail.value);
};

const handleConfirm = async () => {
  // 表单验证
  if (!formData.value.receiverName.trim()) {
    uni.showToast({
      title: "请输入收件人",
      icon: "none",
    });
    return;
  }

  if (!formData.value.contact.trim()) {
    uni.showToast({
      title: "请输入手机号",
      icon: "none",
    });
    return;
  }

  if (formData.value.region.length === 0) {
    uni.showToast({
      title: "请选择所属地区",
      icon: "none",
    });
    return;
  }

  if (!formData.value.address.trim()) {
    uni.showToast({
      title: "请输入详细地址",
      icon: "none",
    });
    return;
  }
  const params = {
    address: formData.value.address,
    city: formData.value.region[1],
    contact: formData.value.contact,
    defaultFlag: formData.value.defaultFlag,
    district: formData.value.region[2],
    province: formData.value.region[0],
    receiverName: formData.value.receiverName,
    id: addressId.value,
  };
  // 提交数据
  console.log("提交表单数据:", formData.value, params);
  const res = await uni.request({
    url: "http://113.45.219.231:8005//prod-api/wx/app/my/address",
    method: "POST",
    data: params,
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
  });
  console.log("🚀 ~ handleConfirm ~ res:", res);
  if (res.data.code === 200) {
    uni.showToast({
      title: isEdit.value ? "地址修改成功" : "地址创建成功",
      icon: "success",
      duration: 2000,
    });
  }
  // 延迟返回上一页
  setTimeout(() => {
    uni.navigateBack();
  }, 2000);
};

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log("🚀 ~ onMounted ~ currentPage:", currentPage);
  if (currentPage.options?.id) {
    addressId.value = currentPage.options.id;
    isEdit.value = true;
    // 这里可以根据 addressId 加载现有地址数据
    loadAddressData(currentPage.options);
  }
  console.log("🚀 ~ onMounted ~ addressId:", addressId.value, isEdit.value);
});

const loadAddressData = (options: any) => {
  // 从URL参数加载地址数据
  if (isEdit.value && options) {
    formData.value = {
      receiverName: options.receiverName.trim() || "",
      contact: options.contact.trim() || "",
      region: [
        options.province.trim(),
        options.city.trim(),
        options.district.trim(),
      ],
      address: options.address.trim() || "",
      defaultFlag: options.defaultFlag === "true",
    };
  }
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 表单区域 */
.form-section {
  flex: 1;
  padding: 0;
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
  width: 200rpx;
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
  color: rgba(0, 0, 0, 0.85);
  text-align: right;
}

/* 地区选择器 */
.region-picker {
  flex: 1;
}

.picker-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.picker-text {
  font-size: 34rpx;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 16rpx;

  &.placeholder {
    color: #c9cdd4;
  }
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
}

/* 开关项目 */
.switch-item {
  justify-content: space-between;
}

.address-switch {
  transform: scale(0.8);
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
}

.confirm-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}
</style>
