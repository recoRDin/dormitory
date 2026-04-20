import axios ,{ InternalAxiosRequestConfig, AxiosResponse, AxiosError }from "axios";
import { message } from "antd";
import Cookies from "js-cookie";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useAuthStore } from '@/store/useAuthStore';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  meta?: {
    isToken?: boolean;
    [key: string]: unknown;
  };
  _retry?: boolean;
}
// 定义后端报错时的通用数据结构
interface CustomErrorData {
  msg?: string;
  message?: string;
  error_description?: string;
  [key: string]: unknown;
}
const HEADER_TENANT = 'tenantID';
const HEADER_AUTH = 'Authorization';

let isRefreshing = false;
let isErrorShown = false;
let requestQueue: ((token: string) => void)[] = [];

NProgress.configure({ showSpinner: false });

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  requestQueue.push(cb);
};

const onRefreshed = (token: string) => {
  requestQueue.forEach((cb) => cb(token));
  requestQueue = [];
};

const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  withCredentials: true, // 跨域允许带 cookie
});

const refreshTokenApi = async (): Promise<string> => {
  const response = await axios.post('/auth/refresh', {}, {
    headers: {
      'Authorization': `bearer ${Cookies.get('refresh_token')}`
    }
  });
  return response.data.data.token || response.data.token;
}
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        
        NProgress.start();
        isErrorShown = false; 

        const token = Cookies.get('token');
        const tenantId = useAuthStore.getState().tenantId;

        if(tenantId){
            config.headers[HEADER_TENANT] = tenantId;
        }

        const customConfig = config as CustomRequestConfig;
        //是否需要token
        const isTokenRequired = customConfig.meta?.isToken !== false;

        if (token && isTokenRequired) {
            customConfig.headers[HEADER_AUTH] = `bearer ${token}`;
        }

        return customConfig;
    },
    (error) =>  Promise.reject(error)
);


request.interceptors.response.use(
    (response: AxiosResponse) => {
    NProgress.done();
    const res = response.data;
    
    // 获取状态信息 (兼容多种后端格式)
    const status = res.error_code || res.code || response.status;
    const msg = res.msg || res.error_description || '系统错误';

    // 业务报错处理
    if (status !== 200) {
      message.error(msg);
      return Promise.reject(new Error(msg));
    }
    
    // 完美解包
    return res.data !== undefined ? res.data : res;
  },
  async (error: AxiosError) => {
    NProgress.done();
    const config = error.config as CustomRequestConfig;
    
    if (!config) return Promise.reject(error);

    if (error.response) {
      const status = error.response.status;

      // 触发无感刷新队列机制
      if (status === 401 && !config._retry) {
        config._retry = true;

        if (isRefreshing) {
          // 正在刷新中，把当前的请求装进等待队列
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken: string) => {
              config.headers[HEADER_AUTH] = `bearer ${newToken}`;
              resolve(request(config)); // 刷新成功后，重新发起请求
            });
          });
        }

        isRefreshing = true;

        try {
          // 去换新 Token
          const newToken = await refreshTokenApi();
          isRefreshing = false;
          
          Cookies.set('token', newToken); 
          
          onRefreshed(newToken);

          // 重新发起引发 401 的那个最初请求
          config.headers[HEADER_AUTH] = `bearer ${newToken}`;
          return request(config);

        } catch (refreshErr) {
          isRefreshing = false;
          requestQueue = [];
          
          if (!isErrorShown) {
            isErrorShown = true;
            message.error('登录状态已失效，请重新登录');
          }
          
          // 清理现场并踢走
          Cookies.remove('token');
          Cookies.remove('refresh_token');
          useAuthStore.getState().clearAuth();
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      }

      // 正常的错误拦截
      const errorData = error.response.data as CustomErrorData;
      if (!isErrorShown) {
        message.error(errorData?.msg || errorData?.message || '网络请求异常');
      }
    } else {
      message.error('网络连接断开，请检查网络');
    }

    return Promise.reject(error);
  }
);

export default request;