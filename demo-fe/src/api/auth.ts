import request from '@/utils/request'
import { UserInfoData } from '@/types/system';  


export const getUserInfo = async (): Promise<UserInfoData> => {

   return request.get('/api/system/menu/routes');

};