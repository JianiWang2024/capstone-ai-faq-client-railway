import axios from 'axios';
import { getBackendUrl, isProduction } from '../config';

const API_BASE_URL = getBackendUrl();

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // 30秒超时（Azure环境需要更长时间）

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在生产环境中添加额外的请求头
    if (isProduction()) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('API Error:', status, data);
      
      // 为401错误添加特殊处理
      if (status === 401) {
        console.log('ℹ️ 401 Unauthorized - User needs to login');
        // 不要将401作为错误处理，这是正常的认证流程
      }
    } else if (error.request) {
      // 请求发送失败
      console.error('Network Error:', error.message);
    } else {
      // 其他错误
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/logout`);
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/current-user`);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

export default authApi;