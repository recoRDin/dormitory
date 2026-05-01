'use client';

import { useState } from 'react';
import { Form ,Input, Button,message,Card } from "antd";
import { useRouter ,useSearchParams } from 'next/navigation'; // 注意：Next.js 14 App Router 必须从 navigation 引入
import Cookies from 'js-cookie'; // 引入 cookie 工具
import { useAuthStore } from '@/store/useAuthStore'; // 引入状态仓库
import { formatPermissionTree } from '@/utils/permission'; // 引入清洗函数
import { loginApi } from '@/api/auth';

export default function LoginPage() {
    const router = useRouter(); 
    const searchParams = useSearchParams();
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; password: string }) => {

      setLoading(true);
      try{

        const token = await loginApi({
          account: values.username,
          password:values.password,
        });

        
            // 存入cookie（过期时间1天，和JWT过期时间对齐）
            Cookies.set('token', token, { expires: 1 });

            // 暂时用模拟菜单数据（后续对接权限接口后替换）
            const mockRawTree = [
                {
                    id: '1', parentId: '0', name: '首页', category: 1 as const,
                },
                {
                    id: '2', parentId: '0', name: '学生管理', category: 1 as const,
                },
            ];
            const { menuTree, buttonCodes } = formatPermissionTree(mockRawTree);
            setAuthData(menuTree, buttonCodes);

            message.success('登录成功！');

            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
      }catch{
        //错误已在request中拦截
      }finally{
        setLoading(false);
      }
};

return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="后台登录" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号！' }]}>
            <Input placeholder="账号" />
          </Form.Item>
          
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}