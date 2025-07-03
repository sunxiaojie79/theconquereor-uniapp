import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  level: number
  levelName: string
  totalDistance: number
  totalSteps: number
  completedChallenges: number
  medals: number
  points: number
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    id: '10086',
    nickname: '旅行者10086',
    avatar: '/static/avatar.png',
    level: 7,
    levelName: '环球探险家',
    totalDistance: 4286,
    totalSteps: 0,
    completedChallenges: 8,
    medals: 15,
    points: 4286
  })

  const todaySteps = ref(6728)
  const todayDistance = ref(4.7)
  const todayCalories = ref(245)

  // 计算属性
  const userLevel = computed(() => {
    return `${userInfo.value.levelName} LV.${userInfo.value.level}`
  })

  const todayDistanceKm = computed(() => {
    return `${todayDistance.value}公里`
  })

  // 方法
  function updateTodaySteps(steps: number) {
    todaySteps.value = steps
    // 1步约等于0.7米
    todayDistance.value = Math.round((steps * 0.7 / 1000) * 10) / 10
    // 简单的卡路里计算
    todayCalories.value = Math.round(steps * 0.04)
  }

  function updateUserInfo(info: Partial<UserInfo>) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  function addDistance(distance: number) {
    userInfo.value.totalDistance += distance
    todayDistance.value += distance
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
    addDistance
  }
}) 