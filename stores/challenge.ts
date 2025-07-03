import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Challenge {
  id: string
  name: string
  description: string
  totalDistance: number
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  participants: number
  rating: number
  reviews: number
  image: string
  estimatedDays: number
  rewards: string[]
  isActive?: boolean
  progress?: number
  currentDistance?: number
}

export interface UserChallenge {
  challengeId: string
  challenge: Challenge
  progress: number
  currentDistance: number
  startDate: string
  estimatedFinishDate: string
  isCompleted: boolean
}

export const useChallengeStore = defineStore('challenge', () => {
  // 所有可用挑战
  const challenges = ref<Challenge[]>([
    {
      id: '1',
      name: '丝绸之路',
      description: '丝绸之路是连接中国与中亚、西亚乃至欧洲的古代贸易通道，已有2000多年历史。沿着这条路线，你将穿越沙漠、草原和山脉，探索古代文明的遗迹。',
      totalDistance: 1024,
      difficulty: 'medium',
      theme: '历史主题',
      participants: 12456,
      rating: 4.5,
      reviews: 3287,
      image: '/static/challenges/silk-road.jpg',
      estimatedDays: 45,
      rewards: ['电子版证书', '实体奖牌', '限定周边']
    },
    {
      id: '2',
      name: '撒哈拉沙漠',
      description: '世界上最大的热沙漠，充满挑战与神秘。',
      totalDistance: 2450,
      difficulty: 'hard',
      theme: '自然探索',
      participants: 8742,
      rating: 4.0,
      reviews: 2156,
      image: '/static/challenges/sahara.jpg',
      estimatedDays: 80,
      rewards: ['电子版证书', '实体奖牌']
    },
    {
      id: '3',
      name: '长城徒步',
      description: '中华民族的象征，感受历史的厚重。',
      totalDistance: 650,
      difficulty: 'easy',
      theme: '亲子友好',
      participants: 15873,
      rating: 5.0,
      reviews: 4671,
      image: '/static/challenges/great-wall.jpg',
      estimatedDays: 30,
      rewards: ['电子版证书', '实体奖牌', '文创周边']
    },
    {
      id: '4',
      name: '亚马逊探险',
      description: '探索神秘的亚马逊雨林，感受自然的力量。',
      totalDistance: 1840,
      difficulty: 'medium',
      theme: '自然探索',
      participants: 6543,
      rating: 4.3,
      reviews: 1892,
      image: '/static/challenges/amazon.jpg',
      estimatedDays: 60,
      rewards: ['电子版证书', '实体奖牌']
    }
  ])

  // 用户参与的挑战
  const userChallenges = ref<UserChallenge[]>([
    {
      challengeId: '1',
      challenge: challenges.value[0],
      progress: 32,
      currentDistance: 328,
      startDate: '2024-11-15',
      estimatedFinishDate: '2024-12-30',
      isCompleted: false
    },
    {
      challengeId: '3',
      challenge: challenges.value[2],
      progress: 15,
      currentDistance: 98,
      startDate: '2024-12-01',
      estimatedFinishDate: '2025-01-15',
      isCompleted: false
    }
  ])

  // 热门挑战
  const popularChallenges = computed(() => {
    return challenges.value
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 3)
  })

  // 正在进行的挑战
  const activeChallenges = computed(() => {
    return userChallenges.value.filter(uc => !uc.isCompleted)
  })

  // 已完成的挑战
  const completedChallenges = computed(() => {
    return userChallenges.value.filter(uc => uc.isCompleted)
  })

  // 方法
  function getChallengeById(id: string) {
    return challenges.value.find(c => c.id === id)
  }

  function joinChallenge(challengeId: string) {
    const challenge = getChallengeById(challengeId)
    if (!challenge) return false

    const existingChallenge = userChallenges.value.find(uc => uc.challengeId === challengeId)
    if (existingChallenge) return false

    const userChallenge: UserChallenge = {
      challengeId,
      challenge,
      progress: 0,
      currentDistance: 0,
      startDate: new Date().toISOString().split('T')[0],
      estimatedFinishDate: new Date(Date.now() + challenge.estimatedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCompleted: false
    }

    userChallenges.value.push(userChallenge)
    return true
  }

  function updateChallengeProgress(challengeId: string, distance: number) {
    const userChallenge = userChallenges.value.find(uc => uc.challengeId === challengeId)
    if (!userChallenge) return

    userChallenge.currentDistance += distance
    userChallenge.progress = Math.round((userChallenge.currentDistance / userChallenge.challenge.totalDistance) * 100)
    
    if (userChallenge.progress >= 100) {
      userChallenge.isCompleted = true
      userChallenge.progress = 100
    }
  }

  function searchChallenges(keyword: string) {
    return challenges.value.filter(challenge => 
      challenge.name.includes(keyword) || 
      challenge.description.includes(keyword) ||
      challenge.theme.includes(keyword)
    )
  }

  function filterChallenges(theme?: string, difficulty?: string) {
    return challenges.value.filter(challenge => {
      const matchTheme = !theme || challenge.theme === theme
      const matchDifficulty = !difficulty || challenge.difficulty === difficulty
      return matchTheme && matchDifficulty
    })
  }

  return {
    challenges,
    userChallenges,
    popularChallenges,
    activeChallenges,
    completedChallenges,
    getChallengeById,
    joinChallenge,
    updateChallengeProgress,
    searchChallenges,
    filterChallenges
  }
}) 