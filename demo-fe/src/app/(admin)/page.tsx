'use client';

import { Card, Typography, Row, Col, Statistic } from 'antd';
import { UserOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminHome() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        系统概览
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="学生总数" value={0} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="宿舍楼" value={0} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="班级数" value={0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="空闲床位" value={0} prefix={<HomeOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
