<template>
  <web-view :src="src"></web-view>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { h5Url } from "@/config/dev.env";
// const src = ref("https://theconqueror.cn/map/#/home");
const src = ref(`${h5Url}/map/#/home`);

onMounted(async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  console.log("🚀 ~ onMounted ~ currentPage:", currentPage);
  if (currentPage.options?.id) {
    src.value += `?id=${currentPage.options.id}&token=${uni.getStorageSync(
      "token"
    )}`;
  }
  console.log("🚀 ~ onMounted ~ src:", src.value);
});
</script>
