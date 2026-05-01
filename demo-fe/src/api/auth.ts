import request from '@/utils/request'
import { UserInfoData } from '@/types/system';  
import type { LoginDTO } from '@/types/system';

/** 登录 */
export function loginApi(data: LoginDTO) {
  return request.post<string>('/auth/login', data);
}

export const getUserInfo = async (): Promise<UserInfoData> => {

   return request.get('/api/system/menu/routes');

};