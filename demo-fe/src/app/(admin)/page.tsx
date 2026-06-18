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

const { Title } = Typography;

export default function AdminHome() {
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
      <Title level={4} style={{ marginBottom: 24 }}>
        系统概览
      </Title>
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
