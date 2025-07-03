import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Friend {
  id: string
  nickname: string
  avatar: string
  weeklyDistance: number
  totalDistance: number
  currentChallenge?: string
  challengeProgress?: number
  lastActiveTime: string
}

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  challengeId: string
  challengeName: string
  totalProgress: number
  totalDistance: number
  targetDistance: number
  rank: number
  createdAt: string
  isLeader: boolean
}

export interface TeamMember {
  id: string
  nickname: string
  avatar: string
  distance: number
  rank: number
  isLeader: boolean
}

export interface TeamActivity {
  id: string
  userId: string
  nickname: string
  avatar: string
  content: string
  time: string
  type: 'exercise' | 'achievement' | 'message'
}

export const useSocialStore = defineStore('social', () => {
  // 好友列表
  const friends = ref<Friend[]>([
    {
      id: '1',
      nickname: '跑步达人',
      avatar: '/static/avatars/friend1.png',
      weeklyDistance: 32.7,
      totalDistance: 1286,
      currentChallenge: '丝绸之路',
      challengeProgress: 45,
      lastActiveTime: '2024-12-24 10:30'
    },
    {
      id: '2',
      nickname: '徒步旅行者',
      avatar: '/static/avatars/friend2.png',
      weeklyDistance: 28.3,
      totalDistance: 987,
      currentChallenge: '长城徒步',
      challengeProgress: 68,
      lastActiveTime: '2024-12-24 09:15'
    },
    {
      id: '3',
      nickname: '骑行爱好者',
      avatar: '/static/avatars/friend3.png',
      weeklyDistance: 21.8,
      totalDistance: 1543,
      currentChallenge: '亚马逊探险',
      challengeProgress: 23,
      lastActiveTime: '2024-12-24 08:45'
    },
    {
      id: '4',
      nickname: '城市漫步者',
      avatar: '/static/avatars/friend4.png',
      weeklyDistance: 18.9,
      totalDistance: 756,
      currentChallenge: '城市探索',
      challengeProgress: 75,
      lastActiveTime: '2024-12-23 20:30'
    }
  ])

  // 用户在好友中的排名
  const userWeeklyDistance = ref(24.5)
  const userRank = ref(3)

  // 团队信息
  const currentTeam = ref<Team>({
    id: '1',
    name: '丝路探险队',
    members: [
      {
        id: 'user',
        nickname: '旅行者10086',
        avatar: '/static/avatar.png',
        distance: 128,
        rank: 1,
        isLeader: true
      },
      {
        id: '1',
        nickname: '跑步达人',
        avatar: '/static/avatars/friend1.png',
        distance: 115,
        rank: 2,
        isLeader: false
      },
      {
        id: '2',
        nickname: '徒步旅行者',
        avatar: '/static/avatars/friend2.png',
        distance: 98,
        rank: 3,
        isLeader: false
      },
      {
        id: '3',
        nickname: '城市漫步者',
        avatar: '/static/avatars/friend4.png',
        distance: 76,
        rank: 4,
        isLeader: false
      }
    ],
    challengeId: '1',
    challengeName: '丝绸之路',
    totalProgress: 45,
    totalDistance: 462,
    targetDistance: 1024,
    rank: 32,
    createdAt: '2024-11-15',
    isLeader: true
  })

  // 团队动态
  const teamActivities = ref<TeamActivity[]>([
    {
      id: '1',
      userId: '1',
      nickname: '跑步达人',
      avatar: '/static/avatars/friend1.png',
      content: '今天跑了12公里，为团队贡献了不少进度，大家加油！',
      time: '2小时前',
      type: 'exercise'
    },
    {
      id: '2',
      userId: '2',
      nickname: '徒步旅行者',
      avatar: '/static/avatars/friend2.png',
      content: '周末打算去郊外徒步，预计能完成20公里，争取超越第一名！',
      time: '昨天',
      type: 'message'
    }
  ])

  // 计算属性
  const friendsRanking = computed(() => {
    const allUsers = [
      ...friends.value.map(friend => ({
        ...friend,
        distance: friend.weeklyDistance,
        isCurrentUser: false
      })),
      {
        id: 'user',
        nickname: '旅行者10086',
        avatar: '/static/avatar.png',
        distance: userWeeklyDistance.value,
        isCurrentUser: true
      }
    ]

    return allUsers
      .sort((a, b) => b.distance - a.distance)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
  })

  const userRankInFriends = computed(() => {
    const ranking = friendsRanking.value
    return ranking.find(user => user.isCurrentUser)?.rank || 0
  })

  const teamTotalDistance = computed(() => {
    return currentTeam.value.members.reduce((total, member) => total + member.distance, 0)
  })

  const teamProgress = computed(() => {
    return Math.round((teamTotalDistance.value / currentTeam.value.targetDistance) * 100)
  })

  // 方法
  function sendEnergyToFriend(friendId: string) {
    const friend = friends.value.find(f => f.id === friendId)
    if (friend) {
      uni.showToast({
        title: `已向${friend.nickname}送出能量`,
        icon: 'success'
      })
    }
  }

  function inviteFriendToTeam(friendId: string) {
    const friend = friends.value.find(f => f.id === friendId)
    if (friend && currentTeam.value.members.length < 10) {
      const newMember: TeamMember = {
        id: friend.id,
        nickname: friend.nickname,
        avatar: friend.avatar,
        distance: 0,
        rank: currentTeam.value.members.length + 1,
        isLeader: false
      }
      currentTeam.value.members.push(newMember)
      uni.showToast({
        title: `已邀请${friend.nickname}加入团队`,
        icon: 'success'
      })
    }
  }

  function updateTeamMemberDistance(memberId: string, distance: number) {
    const member = currentTeam.value.members.find(m => m.id === memberId)
    if (member) {
      member.distance += distance
      // 重新排序
      currentTeam.value.members.sort((a, b) => b.distance - a.distance)
      currentTeam.value.members.forEach((member, index) => {
        member.rank = index + 1
      })
    }
  }

  function createTeam(name: string, challengeId: string) {
    // 模拟创建团队
    uni.showToast({
      title: `团队"${name}"创建成功`,
      icon: 'success'
    })
  }

  function joinTeam(teamId: string) {
    // 模拟加入团队
    uni.showToast({
      title: '成功加入团队',
      icon: 'success'
    })
  }

  function leaveTeam() {
    // 模拟离开团队
    uni.showModal({
      title: '确认离开',
      content: '确定要离开当前团队吗？',
      success: (res) => {
        if (res.confirm) {
          uni.showToast({
            title: '已离开团队',
            icon: 'success'
          })
        }
      }
    })
  }

  function addTeamActivity(activity: Omit<TeamActivity, 'id'>) {
    const newActivity: TeamActivity = {
      id: Date.now().toString(),
      ...activity
    }
    teamActivities.value.unshift(newActivity)
  }

  function shareTeam() {
    // 模拟分享团队
    uni.showToast({
      title: '团队信息已分享',
      icon: 'success'
    })
  }

  function getFriendById(id: string) {
    return friends.value.find(f => f.id === id)
  }

  return {
    friends,
    userWeeklyDistance,
    userRank,
    currentTeam,
    teamActivities,
    friendsRanking,
    userRankInFriends,
    teamTotalDistance,
    teamProgress,
    sendEnergyToFriend,
    inviteFriendToTeam,
    updateTeamMemberDistance,
    createTeam,
    joinTeam,
    leaveTeam,
    addTeamActivity,
    shareTeam,
    getFriendById
  }
}) 