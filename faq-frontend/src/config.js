// API Configuration
export const API_CONFIG = {
  // Development configuration (本地开发)
  development: {
    BACKEND_URL: 'http://127.0.0.1:5000',
    API_BASE: 'http://127.0.0.1:5000/api',
    FRONTEND_PORT: 3000,
    BACKEND_PORT: 5000
  },
  
  // Production configuration (Railway 生产环境)
  production: {
    BACKEND_URL: 'https://your-app-name.up.railway.app',
    API_BASE: 'https://your-app-name.up.railway.app/api',
    FRONTEND_PORT: 80,
    BACKEND_PORT: 80
  }
};

// Environment detection - 强制在Railway域名下使用生产配置
export const isProduction = () => {
  const hostname = window.location.hostname;
  return hostname.includes('railway.app') || 
         hostname.includes('up.railway.app') ||
         hostname !== 'localhost' ||
         process.env.NODE_ENV === 'production';
};

// Environment-specific configuration
export const getApiUrl = () => {
  if (isProduction()) {
    console.log('🚀 Using production environment API configuration');
    return process.env.REACT_APP_API_URL || API_CONFIG.production.API_BASE;
  }
  console.log('🔧 Using development environment API configuration');
  return API_CONFIG.development.API_BASE;
};

export const getBackendUrl = () => {
  if (isProduction()) {
    console.log('🚀 Using production environment backend configuration');
    return process.env.REACT_APP_BACKEND_URL || API_CONFIG.production.BACKEND_URL;
  }
  console.log('🔧 Using development environment backend configuration');
  return API_CONFIG.development.BACKEND_URL;
};

// 便捷的 API 调用函数
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // 包含cookies
    signal: AbortSignal.timeout(30000), // 30秒超时
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// 获取当前环境信息
export const getEnvironmentInfo = () => {
  return {
    isProduction: isProduction(),
    apiUrl: getApiUrl(),
    backendUrl: getBackendUrl(),
    nodeEnv: process.env.NODE_ENV,
    hostname: window.location.hostname
  };
};

// 强制在Railway域名下使用生产配置
if (window.location.hostname.includes('railway.app') || window.location.hostname.includes('up.railway.app')) {
  console.log('🚀 Railway environment detected, forcing production configuration');
  console.log('Forced API URL:', API_CONFIG.production.API_BASE);
  console.log('Forced backend URL:', API_CONFIG.production.BACKEND_URL);
}

console.log('Environment Info:', getEnvironmentInfo());
console.log('API URL:', getApiUrl());
console.log('Backend URL:', getBackendUrl());

