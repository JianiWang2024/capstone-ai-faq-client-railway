import axios from 'axios';
import { getApiUrl, isProduction } from '../config';

const API_BASE = getApiUrl();

// 配置axios实例
const faqApiInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30秒超时（Azure环境需要更长时间）
  withCredentials: true
});

// 添加请求拦截器
faqApiInstance.interceptors.request.use(
  (config) => {
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
faqApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('FAQ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('FAQ API Network Error:', error.message);
    } else {
      console.error('FAQ API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getFaqs = () => faqApiInstance.get('/faqs');
export const addFaq = (faq) => faqApiInstance.post('/faqs', faq);
export const deleteFaq = (id) => faqApiInstance.delete(`/faqs/${id}`);
export const updateFaq = (id, faq) => faqApiInstance.put(`/faqs/${id}`, faq);
export const searchFaqs = (query) => faqApiInstance.get(`/faqs/search?q=${encodeURIComponent(query)}`);