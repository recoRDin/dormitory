'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import request from '@/utils/request';
import { getBuildingList } from '@/api/Building';
import { getClassList } from '@/api/Class';
import { getRoomPage } from '@/api/Room';
import { useAuthStore } from '@/store/useAuthStore';
const { Title } = Typography;

function getAccountFromJwt(): string | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (!match) return null;
    const token = match[1];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.account || null;
  } catch {
    return null;
  }
}

export default function AdminHome() {
  const tenantId = useAuthStore((s) => s.tenantId);
  const roleCode = useAuthStore((s) => s.roleCode);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    setAccount(getAccountFromJwt());
  }, []);

  const ROLE_LABEL: Record<string, string> = {
    admin: '管理员',
    manager: '宿管',
    student: '学生',
  };

  const [stats, setStats] = useState({
    studentCount: 0,
    buildingCount: 0,
    classCount: 0,
    freeBedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [students, buildings, classes, roomRes] = await Promise.all([
          request.get<any[]>('/student/page', { params: { current: 1, size: 1 } })
            .then((res: any) => res?.total ?? res?.records?.length ?? 0)
            .catch(() => 0),
          getBuildingList().catch(() => []),
          getClassList().catch(() => []),
          getRoomPage({ current: 1, size: 1000 }).catch(() => null),
        ]);

        const freeBeds = roomRes
          ? roomRes.records.reduce((sum, r) => sum + (r.capacity - r.currentCount), 0)
          : 0;

        setStats({
          studentCount: Number(students) || 0,
          buildingCount: Array.isArray(buildings) ? buildings.length : 0,
          classCount: Array.isArray(classes) ? classes.length : 0,
          freeBedCount: freeBeds,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          你好，{account || '用户'}
        </Title>
        <Typography.Text type="secondary">
          学校：{tenantId}　|　角色：{roleCode ? ROLE_LABEL[roleCode] : '-'}
        </Typography.Text>
      </div>
      <Title level={5} style={{ marginBottom: 16 }}>系统概览</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学生总数"
              value={stats.studentCount}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="宿舍楼"
              value={stats.buildingCount}
              prefix={<HomeOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="班级数"
              value={stats.classCount}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="空闲床位"
              value={stats.freeBedCount}
              prefix={<AppstoreOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
