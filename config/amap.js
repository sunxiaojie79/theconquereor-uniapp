// 高德地图配置文件
export const amapConfig = {
  // 高德地图API Key (请在高德开放平台申请: https://lbs.amap.com/)
  // 微信小程序需要申请微信小程序类型的key
  key: 'YOUR_AMAP_KEY_HERE', // 请替换为你的高德地图API Key
  
  // 微信小程序插件配置
  plugin: {
    // 高德地图微信小程序插件AppID
    appId: 'wx06af10f87ee91d11',
    version: '2.0.0'
  },
  
  // 安全域名配置 (需要在微信小程序后台配置)
  domains: [
    'https://restapi.amap.com',
    'https://webapi.amap.com'
  ],
  
  // 地图样式配置
  mapStyle: {
    // 默认地图样式
    normal: 'normal',
    // 卫星图
    satellite: 'satellite',
    // 自定义样式ID (可在高德控制台自定义地图样式)
    custom: 'YOUR_CUSTOM_STYLE_ID'
  },
  
  // 默认地图配置
  defaultMapOptions: {
    scale: 10,
    showLocation: true,
    showCompass: true,
    enableOverlooking: true,
    enableZoom: true,
    enableScroll: true,
    enableRotate: true,
    showScale: false
  },
  
  // 地图主题色彩
  themeColors: {
    primary: '#165DFF',
    secondary: '#4A90E2',
    success: '#00B42A',
    warning: '#FF6B35',
    danger: '#F7931E'
  }
}

// 获取高德地图API Key
export const getAmapKey = () => {
  if (amapConfig.key === 'YOUR_AMAP_KEY_HERE') {
    console.warn('请配置高德地图API Key')
    return ''
  }
  return amapConfig.key
}

// 验证API Key是否配置
export const isAmapKeyConfigured = () => {
  return amapConfig.key !== 'YOUR_AMAP_KEY_HERE' && amapConfig.key.length > 0
}

// 创建地图标记点配置
export const createMarkerConfig = (options = {}) => {
  return {
    width: 30,
    height: 40,
    ...options
  }
}

// 创建路线配置
export const createPolylineConfig = (options = {}) => {
  return {
    color: amapConfig.themeColors.primary,
    width: 4,
    dottedLine: false,
    arrowLine: true,
    borderColor: '#ffffff',
    borderWidth: 2,
    ...options
  }
}

export default amapConfig 