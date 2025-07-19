<template>
  <web-view :src="codeUrl"></web-view>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
const codeUrl = ref("");
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  codeUrl.value = currentPage.options.codeUrl;
  console.log("🚀 ~ onMounted ~ codeUrl:", codeUrl.value);
});
</script>
