import request from '@/utils/request'
import { UserInfoData } from '@/types/system';  
import type { LoginDTO } from '@/types/system';

/** 登录 */
export function loginApi(data: LoginDTO) {
  return request.post<string>('/auth/login', data);
}

export interface CreateUserParams {
  account: string;
  password: string;
  name?: string;
  roleId: number;
  tenantId?: string;
}

/** 管理员创建用户 */
export function createUserApi(data: CreateUserParams) {
  return request.post<string>('/user/create', data);
}

export interface UpdateUserParams {
  password?: string;
  roleId?: number;
  tenantId?: string;
}

/** 管理员修改用户 */
export function updateUserApi(id: number, data: UpdateUserParams) {
  return request.put<string>(`/user/${id}`, data);
}

/** 管理员删除用户 */
export function deleteUserApi(id: number) {
  return request.delete<string>(`/user/${id}`);
}

export const getUserInfo = async (): Promise<UserInfoData> => {

   return request.get('/api/system/menu/routes');

};