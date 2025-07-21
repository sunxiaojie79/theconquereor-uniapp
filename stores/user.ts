import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface UserInfo {
  id: string;
  userNickname: string;
  avatar: string;
  level: number;
  levelName: string;
  totalDistance: number;
  totalSteps: number;
  completedChallenges: number;
  medals: number;
  points: number;
}

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo>({
    id: "",
    userNickname: "微信用户",
    avatar:
      "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
    level: 0,
    levelName: "环球探险家",
    totalDistance: 0,
    totalSteps: 0,
    completedChallenges: 8,
    medals: 0,
    points: 0,
  });

  const todaySteps = ref(6728);
  const todayDistance = ref(4.7);
  const todayCalories = ref(245);
  const token = ref("");

  // 计算属性
  const userLevel = computed(() => {
    return `${userInfo.value.levelName} LV.${userInfo.value.level}`;
  });

  const todayDistanceKm = computed(() => {
    return `${todayDistance.value}公里`;
  });

  // 方法
  function updateTodaySteps(steps: number) {
    todaySteps.value = steps;
    // 1步约等于0.7米
    todayDistance.value = Math.round(((steps * 0.7) / 1000) * 10) / 10;
    // 简单的卡路里计算
    todayCalories.value = Math.round(steps * 0.04);
  }

  function updateUserInfo(info: Partial<UserInfo>) {
    console.log("🚀 ~ updateUserInfo ~ info:", info);
    userInfo.value = { ...userInfo.value, ...info };
    console.log("🚀 ~ updateUserInfo ~ userInfo.value:", userInfo.value);
  }

  function addDistance(distance: number) {
    userInfo.value.totalDistance += distance;
    todayDistance.value += distance;
  }

  function updateToken(token: string) {
    token = token;
  }

  return {
    userInfo,
    todaySteps,
    todayDistance,
    todayCalories,
    userLevel,
    todayDistanceKm,
    updateTodaySteps,
    updateUserInfo,
    addDistance,
    token,
    updateToken,
  };
});
