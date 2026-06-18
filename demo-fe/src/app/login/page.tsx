'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Card } from "antd";
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/useAuthStore';
import { loginApi } from '@/api/auth';
import type { RoleCode } from '@/utils/permission';

interface JwtPayload {
  user_id: number;
  tenant_id: string;
  role_id: number;
  role_code: RoleCode;
  account: string;
}

function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(atob(parts[1]));
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setRole = useAuthStore((state) => state.setRole);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; password: string }) => {
      setLoading(true);
      try {
        const token = await loginApi({
          account: values.username,
          password: values.password,
        });

        Cookies.set('token', token, { expires: 1 });

        const payload = decodeJwtPayload(token);
        setRole(payload.role_id, payload.role_code, payload.tenant_id, payload.account);

        message.success('登录成功！');

        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      } catch {
        // 错误已在 request 拦截器中处理
      } finally {
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
