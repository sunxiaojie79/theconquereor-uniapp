<template>
  <view class="page">
    <view class="address-list">
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(item, index) in addressList"
          :key="item.id"
          :index="index"
        >
          <view class="address-item" @click="selectAddress(item)">
            <view class="address-info">
              <view class="address-header">
                <view class="status-icons">
                  <image
                    v-if="item.isSelected"
                    class="selected-icon"
                    src="/static/cell-on.png"
                    mode="aspectFit"
                  />
                  <view v-if="item.isDefault" class="default-tag">
                    <text class="default-text">默认</text>
                  </view>
                  <view class="address-region">
                    <text>{{ item.region }} </text>
                  </view>
                </view>
                <image
                  class="edit-icon"
                  src="/static/edit.png"
                  mode="aspectFill"
                  @click.stop="editAddress(item)"
                ></image>
              </view>
              <view class="address-detail">
                <text>{{ item.detail }}</text>
              </view>
              <view class="name-phone">
                <text class="name">{{ item.name }}</text>
                <text class="phone">{{ item.phone }}</text>
              </view>
            </view>
          </view>
          <template v-slot:right>
            <view class="delete-btn-container">
            <view class="delete-btn">
              <image
                  class="delete-icon"
                  src="/static/delete.png"
                  mode="aspectFill"
                  @click.stop="deleteAddress(index)"
                ></image>
            </view>
          </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showDeleteModal"
      title="删除地址"
      message="确定要删除这个地址吗？删除后无法恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- 新增地址按钮 -->
    <view class="add-address-section">
      <button class="add-address-btn" @click="addAddress">
        <text class="add-address-text">新增地址</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

// 响应式数据
const addressList = ref([]);
const showDeleteModal = ref(false);
const deleteIndex = ref(-1);
const options2 = [
  {
    text: "收藏",
    style: {
      backgroundColor: "#3c9cff",
    },
  },
  {
    text: "删除",
    style: {
      backgroundColor: "#f56c6c",
    },
  },
];
// 初始化地址列表数据
const initAddressList = () => {
  addressList.value = [
    {
      id: 1,
      name: "张三",
      phone: "13612345678",
      region: "广东省广州市黄埔区",
      detail: "这是一个算详细地址详情",
      isDefault: true,
      isSelected: true,
    },
    {
      id: 2,
      name: "李四",
      phone: "13812345678",
      region: "广东省深圳市南山区",
      detail: "科技园南区深南大道1001号",
      isDefault: false,
      isSelected: false,
    },
    {
      id: 3,
      name: "王五",
      phone: "13912345678",
      region: "广东省珠海市香洲区",
      detail: "情侣路888号珠海大厦",
      isDefault: false,
      isSelected: false,
    },
  ];
};
// 编辑地址
const editAddress = (item) => {
  // 跳转到编辑地址页面，传递地址信息
  uni.navigateTo({
    url: `/pages/address-edit/index?id=${item.id}&name=${item.name}&phone=${item.phone}&region=${item.region}&detail=${item.detail}&isDefault=${item.isDefault}`,
  });
};

// 删除地址
const deleteAddress = (index) => {
  console.log(index);
  deleteIndex.value = index;
  showDeleteModal.value = true;
};

// 确认删除
const confirmDelete = () => {
  if (deleteIndex.value !== -1) {
    const deletedItem = addressList.value[deleteIndex.value];

    // 如果删除的是默认地址，需要重新设置默认地址
    if (deletedItem.isDefault && addressList.value.length > 1) {
      // 找到第一个非删除的地址设为默认
      const remainingAddresses = addressList.value.filter(
        (_, i) => i !== deleteIndex.value
      );
      if (remainingAddresses.length > 0) {
        const firstAddress = addressList.value.find(
          (_, i) => i !== deleteIndex.value
        );
        if (firstAddress) {
          firstAddress.isDefault = true;
        }
      }
    }

    // 删除地址
    addressList.value.splice(deleteIndex.value, 1);

    uni.showToast({
      title: "删除成功",
      icon: "success",
    });
  }

  showDeleteModal.value = false;
  deleteIndex.value = -1;
};

// 选择地址
const selectAddress = (item) => {
  // 取消其他地址的选中状态
  addressList.value.forEach((address) => {
    address.isSelected = false;
  });

  // 设置当前地址为选中状态
  item.isSelected = true;

  // 可以在这里添加选择地址后的逻辑，比如返回上一页
  uni.showToast({
    title: "已选择该地址",
    icon: "success",
  });

  // 延时返回上一页
  setTimeout(() => {
    uni.navigateBack();
  }, 1000);
};

// 新增地址
const addAddress = () => {
  uni.navigateTo({
    url: "/pages/address-edit/index",
  });
};

// 页面加载时初始化数据
onMounted(() => {
  initAddressList();
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 280rpx; /* 为底部两个按钮留出空间 */
}
.address-list {
  padding: 0 32rpx;
}
.address-item {
  background-color: #ffffff;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.09);
}

.address-info {
  width: 100%;
  padding: 32rpx 0;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx;
}
.edit-icon {
  width: 40rpx;
  height: 40rpx;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.default-tag {
  width: 64rpx;
  height: 40rpx;
  box-sizing: border-box;
  background-color: #fadb47;
  border-radius: 4rpx;
  text-align: center;
  line-height: 40rpx;
}

.default-text {
  font-size: 24rpx;
  color: #333333;
  font-weight: 500;
}

.selected-icon {
  width: 40rpx;
  height: 40rpx;
}
.address-region {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.65);
  font-weight: normal;
}
.address-detail {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: normal;
  margin-bottom: 8rpx;
}

.name-phone {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.85);
}
.name {
  margin-right: 16rpx;
}
.delete-btn-container{
  width: 100rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F02525;;
  color: #fff;
  border-radius: 50%;
  border: 1rpx solid rgba(0, 0, 0, 0.09);
}
.delete-icon {
  width: 32rpx;
  height: 32rpx;
}

.edit-btn {
  background-color: #3c9cff;
  color: #fff;
}

/* 新增地址按钮区域 */
.add-address-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom)) 32rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.add-address-btn {
  width: 100%;
  height: 80rpx;
  background: #fadb47;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-address-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #242a36;
}

.test-dialog-btn {
  width: 100%;
  height: 80rpx;
  background: #3c9cff;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
