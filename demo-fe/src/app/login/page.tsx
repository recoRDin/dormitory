'use client';

import { Form ,Input, Button,message,Card } from "antd";
import { useRouter } from 'next/navigation'; // 注意：Next.js 14 App Router 必须从 navigation 引入
import Cookies from 'js-cookie'; // 引入 cookie 工具
import { useAuthStore } from '@/store/useAuthStore'; // 引入状态仓库
import { formatPermissionTree } from '@/utils/permission'; // 引入清洗函数

export default function LoginPage() {
    const router = useRouter(); 
    const setAuthData = useAuthStore((state) => state.setAuthData);


    const onFinish = (values: { username: string; password: string }) => {

        message.loading({ content: '正在登录...', key: 'login' });

    // 【模拟后端请求】
    setTimeout(() => {
      // 假装这是后端给的脏数据（里面混着菜单和按钮）
      const mockRawTree = [
        {
          id: '1', parentId: '0', name: '系统管理', category: 1 as const,
          children: [
            { id: '2', parentId: '1', name: '用户管理', category: 1 as const, children: [
                { id: '3', parentId: '2', name: '删除用户', category: 2 as const, code: 'sys:user:del' }
            ]}
          ]
        }
      ];
      const mockToken = "super-secret-token-123";


    //清洗数据
    const { menuTree, buttonCodes } = formatPermissionTree(mockRawTree);
    //存入状态库
    setAuthData(menuTree, buttonCodes);

    //存入cookie（过期时间1天）
    Cookies.set('token', mockToken, { expires: 1 });
    message.success({ content: '登录成功！', key: 'login'});

    //强制跳转
    router.push('/');
    }, 1000);
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
            <Button type="primary" htmlType="submit" block>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}