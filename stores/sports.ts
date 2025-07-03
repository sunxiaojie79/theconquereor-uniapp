import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SportsRecord {
  id: string
  date: string
  type: 'walk' | 'run' | 'bike' | 'other'
  distance: number
  duration: number
  calories: number
  steps?: number
  source: 'auto' | 'manual' | 'import'
  challengeId?: string
}

export interface WeeklyData {
  date: string
  distance: number
  steps: number
  calories: number
}

export const useSportsStore = defineStore('sports', () => {
  // 运动记录
  const sportsRecords = ref<SportsRecord[]>([
    {
      id: '1',
      date: '2024-12-24',
      type: 'walk',
      distance: 4.7,
      duration: 60,
      calories: 245,
      steps: 6728,
      source: 'auto'
    },
    {
      id: '2',
      date: '2024-12-23',
      type: 'run',
      distance: 6.2,
      duration: 45,
      calories: 320,
      steps: 8000,
      source: 'manual'
    }
  ])

  // 本周运动数据
  const weeklyData = ref<WeeklyData[]>([
    { date: '2024-12-18', distance: 5.2, steps: 7428, calories: 260 },
    { date: '2024-12-19', distance: 3.8, steps: 5432, calories: 190 },
    { date: '2024-12-20', distance: 6.5, steps: 9286, calories: 335 },
    { date: '2024-12-21', distance: 4.1, steps: 5847, calories: 205 },
    { date: '2024-12-22', distance: 7.3, steps: 10428, calories: 380 },
    { date: '2024-12-23', distance: 6.2, steps: 8000, calories: 320 },
    { date: '2024-12-24', distance: 4.7, steps: 6728, calories: 245 }
  ])

  // 计算属性
  const todayRecord = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return sportsRecords.value.find(record => record.date === today)
  })

  const weeklyTotalDistance = computed(() => {
    return weeklyData.value.reduce((total, day) => total + day.distance, 0)
  })

  const weeklyTotalSteps = computed(() => {
    return weeklyData.value.reduce((total, day) => total + day.steps, 0)
  })

  const weeklyAvgDistance = computed(() => {
    return Math.round((weeklyTotalDistance.value / 7) * 10) / 10
  })

  const monthlyTotalDistance = computed(() => {
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    return sportsRecords.value
      .filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear
      })
      .reduce((total, record) => total + record.distance, 0)
  })

  // 方法
  function addSportsRecord(record: Omit<SportsRecord, 'id'>) {
    const newRecord: SportsRecord = {
      id: Date.now().toString(),
      ...record
    }
    sportsRecords.value.unshift(newRecord)
  }

  function updateTodayRecord(data: Partial<SportsRecord>) {
    const today = new Date().toISOString().split('T')[0]
    const existingRecord = sportsRecords.value.find(record => record.date === today)
    
    if (existingRecord) {
      Object.assign(existingRecord, data)
    } else {
      addSportsRecord({
        date: today,
        type: 'walk',
        distance: 0,
        duration: 0,
        calories: 0,
        steps: 0,
        source: 'auto',
        ...data
      })
    }
  }

  function getRecordsByDateRange(startDate: string, endDate: string) {
    return sportsRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return recordDate >= start && recordDate <= end
    })
  }

  function getRecordsByType(type: SportsRecord['type']) {
    return sportsRecords.value.filter(record => record.type === type)
  }

  function getTotalDistanceByChallenge(challengeId: string) {
    return sportsRecords.value
      .filter(record => record.challengeId === challengeId)
      .reduce((total, record) => total + record.distance, 0)
  }

  function importWeChatSports() {
    // 模拟导入微信运动数据
    uni.showToast({
      title: '微信运动数据导入成功',
      icon: 'success'
    })
  }

  function startSportsTracking() {
    // 模拟开始运动追踪
    uni.showToast({
      title: '开始运动追踪',
      icon: 'success'
    })
  }

  function stopSportsTracking() {
    // 模拟停止运动追踪
    uni.showToast({
      title: '运动追踪已停止',
      icon: 'success'
    })
  }

  return {
    sportsRecords,
    weeklyData,
    todayRecord,
    weeklyTotalDistance,
    weeklyTotalSteps,
    weeklyAvgDistance,
    monthlyTotalDistance,
    addSportsRecord,
    updateTodayRecord,
    getRecordsByDateRange,
    getRecordsByType,
    getTotalDistanceByChallenge,
    importWeChatSports,
    startSportsTracking,
    stopSportsTracking
  }
}) 