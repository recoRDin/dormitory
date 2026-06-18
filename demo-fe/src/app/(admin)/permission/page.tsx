'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, Space, Select, Button, message, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { createUserApi, updateUserApi, deleteUserApi } from '@/api/auth';

const { Title, Text } = Typography;

const ROLE_COLORS: Record<string, string> = {
  admin: 'red',
  manager: 'blue',
  student: 'green',
};

const ROLE_LABELS: Record<string, string> = {
  admin: '管理员',
  manager: '宿管',
  student: '学生',
};

const ROLE_OPTIONS = [
  { value: 1, label: '管理员' },
  { value: 2, label: '宿管' },
  { value: 3, label: '学生' },
];

interface UserRow {
  id: number;
  account: string;
  roleId: number;
  roleCode: string;
  roleName: string;
  tenantId: string;
}

export default function PermissionPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await request.get<UserRow[]>('/user/list');
      setUsers(data);
    } catch {
      // ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      await request.put('/user/role', { userId, roleId: newRoleId });
      message.success('角色修改成功');
      fetchUsers();
    } catch {
      // ignored
    }
  };

  const handleCreate = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      await createUserApi(values as { account: string; password: string; name?: string; roleId: number; tenantId?: string });
      message.success('用户创建成功');
      setCreateOpen(false);
      createForm.resetFields();
      fetchUsers();
    } catch {
      // ignored
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: UserRow) => {
    setEditingUser(record);
    editForm.setFieldsValue({
      roleId: record.roleId,
      tenantId: record.tenantId,
      password: '',
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (values: Record<string, unknown>) => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (values.password && (values.password as string).trim()) {
        body.password = values.password;
      }
      body.roleId = values.roleId;
      if (values.tenantId) {
        body.tenantId = values.tenantId;
      }
      await updateUserApi(editingUser.id, body);
      message.success('用户修改成功');
      setEditOpen(false);
      editForm.resetFields();
      fetchUsers();
    } catch {
      // ignored
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserApi(id);
      message.success('用户已删除');
      fetchUsers();
    } catch {
      // ignored
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '学校编号',
      dataIndex: 'tenantId',
    },
    {
      title: '角色',
      dataIndex: 'roleCode',
      render: (code: string) => (
        <Tag color={ROLE_COLORS[code] || 'default'}>
          {ROLE_LABELS[code] || code}
        </Tag>
      ),
    },
    // {
    //   title: '快速改角色',
    //   width: 160,
    //   render: (_: unknown, record: UserRow) => (
    //     <Select
    //       size="small"
    //       style={{ width: 100 }}
    //       value={record.roleId}
    //       onChange={(val) => handleRoleChange(record.id, val)}
    //       options={ROLE_OPTIONS}
    //     />
    //   ),
    // },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: UserRow) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="确定删除该用户？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        权限管理
      </Title>

      <Card title="角色说明" style={{ marginBottom: 24 }}>
        <Space direction="vertical">
          <Text><Tag color="red">管理员</Tag> 可查看所有模块，可增删改数据（受租户隔离）</Text>
          <Text><Tag color="blue">宿管</Tag> 可管理学生/班级/楼宇/房间所有数据</Text>
          <Text><Tag color="green">学生</Tag> 可查看首页</Text>
          <Text type="secondary">超级管理员（租户ID=000000）可查看全部租户数据</Text>
        </Space>
      </Card>

      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            新建用户
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          locale={{ emptyText: '暂无用户' }}
        />
      </Card>

      {/* 新建 */}
      <Modal
        title="新建用户"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="请输入登录账号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item name="tenantId" label="学校标识">
            <Input placeholder="不同学校用不同标识隔离数据" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCreateOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>创建</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑 */}
      <Modal
        title={`编辑用户：${editingUser?.account || ''}`}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="password" label="新密码" help="留空则不修改密码">
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item name="tenantId" label="学校标识">
            <Input placeholder="修改后将关联到新学校" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
