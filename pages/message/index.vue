<template>
  <view class="page">
    <!-- 消息列表 -->
    <view class="message-list">
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(item, index) in messageList"
          :key="item.id"
          :index="index"
        >
          <view class="message-item" @click="readMessage(item)">
            <view class="message-content">
              <view class="message-left">
                <image class="avatar" :src="item.avatar" mode="aspectFill" />
              </view>
              <view class="message-right">
                <view v-if="!item.isRead" class="unread-dot"></view>
                <view
                  class="message-text"
                  :style="{ marginLeft: item.isRead ? '0' : '32rpx' }"
                  >{{ item.content }}</view
                >
                <view class="message-time">{{ item.time }}</view>
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
                  @click.stop="deleteMessage(index)"
                ></image>
              </view>
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>

    <!-- 删除确认弹框 -->
    <ConfirmDialog
      v-model:visible="showDeleteModal"
      title="删除消息"
      message="确定要删除这条消息吗？删除后无法恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

// 响应式数据
const messageList = ref<any[]>([]);
const showDeleteModal = ref(false);
const deleteIndex = ref(-1);

// 初始化消息列表数据
const initMessageList = () => {
  messageList.value = [
    {
      id: 2,
      type: "view",
      avatar: "/static/avatars/friend1.png",
      content: "这是一段风景消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 3,
      type: "postCard",
      avatar: "/static/avatars/friend2.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 4,
      type: "data",
      avatar: "/static/avatars/friend3.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 5,
      type: "view",
      avatar: "/static/avatars/friend4.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 6,
      type: "postCard",
      avatar: "/static/avatars/friend1.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 7,
      type: "data",
      avatar: "/static/avatars/friend2.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 8,
      type: "view",
      avatar: "/static/avatars/friend3.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 9,
      type: "postCard",
      avatar: "/static/avatars/friend4.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 10,
      type: "view",
      avatar: "/static/avatars/friend1.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 11,
      type: "postCard",
      avatar: "/static/avatars/friend2.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 12,
      type: "data",
      avatar: "/static/avatars/friend3.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 13,
      type: "view",
      avatar: "/static/avatars/friend4.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
    {
      id: 14,
      type: "postCard",
      avatar: "/static/avatars/friend1.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: false,
    },
    {
      id: 15,
      type: "data",
      avatar: "/static/avatars/friend2.png",
      content: "这是一段消息内容文案内容文案内容...",
      time: "2025.06.11 12:02",
      isRead: true,
    },
  ];
};

// 删除消息
const deleteMessage = (index: number) => {
  deleteIndex.value = index;
  showDeleteModal.value = true;
};

// 确认删除
const confirmDelete = () => {
  if (deleteIndex.value !== -1) {
    messageList.value.splice(deleteIndex.value, 1);
    uni.showToast({
      title: "删除成功",
      icon: "success",
    });
  }
  showDeleteModal.value = false;
  deleteIndex.value = -1;
};

// 读取消息
const readMessage = (item: any) => {
  // 如果是view类型，跳转到内容详情页面
  if (item.type === 'view') {
    uni.navigateTo({
      url: '/pages/message-detail-view/index'
    });
    return;
  }
  // 如果是postCard类型，跳转到内容详情页面
  if (item.type === 'postCard') {
    uni.navigateTo({
      url: '/pages/message-detail-postcard/index'
    });
    return;
  }
  
  if (!item.isRead) {
    item.isRead = true;
    uni.showToast({
      title: "消息已读",
      icon: "success",
    });
  }
};

onMounted(() => {
  initMessageList();
  console.log("消息列表页面加载完成");
});
</script>

<style lang="scss" scoped>
.page {
  background-color: #f4f5f9;
  min-height: 100vh;
}

.message-list {
  padding: 0 32rpx;
  background-color: #ffffff;
}

/* 普通消息样式 */
.message-item {
  background-color: #ffffff;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.09);
}

.message-content {
  display: flex;
  align-items: center;
  padding: 32rpx 0;
}

.message-left {
  position: relative;
  margin-right: 24rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
}

.unread-dot {
  position: absolute;
  top: 16rpx;
  left: 0rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #f02525;
  border-radius: 50%;
}

.message-right {
  position: relative;
  flex: 1;
}

.message-text {
  font-size: 32rpx;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.4;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-time {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 0.45);
}

/* 删除按钮样式 */
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
</style>
