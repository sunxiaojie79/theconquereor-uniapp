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
                  <view v-if="item.defaultFlag" class="default-tag">
                    <text class="default-text">默认</text>
                  </view>
                  <view class="address-region">
                    <text
                      >{{ item.province }}{{ item.city }}{{ item.district }}
                    </text>
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
                <text>{{ item.address }}</text>
              </view>
              <view class="name-phone">
                <text class="name">{{ item.receiverName }}</text>
                <text class="phone">{{ item.contact }}</text>
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
                  @click.stop="deleteAddress(item.id)"
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
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app"; // 页面生命周期从 uni-app 导入

import ConfirmDialog from "../../components/ConfirmDialog.vue";

// 响应式数据
const addressList = ref([]);
const showDeleteModal = ref(false);
const deleteIndex = ref(-1);

// 获取我的收货地址
const getMyAddress = async () => {
  const res = await uni.request({
    url: "http://113.45.219.231:8005/prod-api/wx/app/my/address/list",
    method: "POST",
    header: {
      "X-WX-TOKEN": uni.getStorageSync("token"),
    },
    data: {},
  });
  console.log("🚀 ~ getMyAddress ~ res:", res);
  if (res.data.code === 200) {
    addressList.value = res.data.rows;
  }
};
// 编辑地址
const editAddress = (item) => {
  // 跳转到编辑地址页面，传递地址信息
  uni.navigateTo({
    url: `/pages/address-edit/index?id=${item.id}&receiverName=${item.receiverName}&contact=${item.contact}
    &province=${item.province}&city=${item.city}&district=${item.district}
    &address=${item.address}&defaultFlag=${item.defaultFlag}`,
  });
};

// 删除地址
const deleteAddress = (id) => {
  console.log(id);
  deleteIndex.value = id;
  showDeleteModal.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (deleteIndex.value !== -1) {
    const deletedItem = addressList.value.find(
      (item) => item.id === deleteIndex.value
    );
    console.log("🚀 ~ confirmDelete ~ deletedItem:", deletedItem);

    // 如果删除的是默认地址，需要重新设置默认地址
    if (deletedItem.defaultFlag && addressList.value.length > 1) {
      // 找到第一个非删除的地址设为默认
      const remainingAddresses = addressList.value.filter(
        (_, i) => i !== deleteIndex.value
      );
      if (remainingAddresses.length > 0) {
        const firstAddress = addressList.value.find(
          (_, i) => i !== deleteIndex.value
        );
        if (firstAddress) {
          firstAddress.defaultFlag = true;
        }
      }
    }
    const res = await uni.request({
      url: `http://113.45.219.231:8005/prod-api/wx/app/my/address/${deleteIndex.value}`,
      method: "DELETE",
      header: {
        "X-WX-TOKEN": uni.getStorageSync("token"),
      },
    });
    console.log("🚀 ~ confirmDelete ~ res:", res);
    if (res.data.code === 200) {
      // 删除地址
      getMyAddress();

      uni.showToast({
        title: "删除成功",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: "删除失败",
        icon: "none",
      });
    }
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

onShow(() => {
  console.log("🚀 ~ onShow ~ onShow");
  getMyAddress();
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
.delete-btn-container {
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
  background-color: #f02525;
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
