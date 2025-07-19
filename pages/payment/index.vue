<template>
  <!-- <web-view :src="codeUrl"></web-view> -->
  <text selectable="true" class="code-url">{{ codeUrl }}</text>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
const codeUrl = ref("");
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  codeUrl.value = decodeURIComponent(currentPage.options.codeUrl);
  console.log("🚀 ~ onMounted ~ currentPage:", currentPage);

  console.log("🚀 ~ onMounted ~ codeUrl:", codeUrl.value);
});
</script>
<style lang="scss" scoped>
.code-url {
  /* 核心：允许长文本在任意位置换行（包括单词/字符中间） */
  word-break: break-all;
  /* 可选：限制容器宽度（确保在可视范围内换行） */
  width: 90%; /* 或使用 rpx：700rpx */
  margin: 0 auto; /* 居中显示 */
  /* 可选：添加边框，直观看到容器范围 */
  // border: 1px solid #eee;
  padding: 10rpx;
}
</style>
