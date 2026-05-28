'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ClassInfo, ClassQuery } from '@/types/class';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Space, Input, Form, Modal, message, Popconfirm } from 'antd';
import { getClassPage, addClass, updateClass, batchDeleteClasses } from '@/api/Class';

export default function ClassPage() {
  const [data, setData] = useState<ClassInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState<ClassQuery>({ current: 1, size: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClassInfo | null>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getClassPage(query);
      setData(res.records);
      setTotal(res.total);
    } catch { /* request 拦截器已处理 */ } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (values: ClassQuery) => {
    setQuery({ ...values, current: 1, size: query.size });
  };

  const handleReset = () => {
    setQuery({ current: 1, size: 10 });
  };

  const openAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: ClassInfo) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateClass({ id: editingRecord.id, ...values });
        message.success('修改成功');
      } else {
        await addClass(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* 校验失败或接口报错 */ }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await batchDeleteClasses(ids);
      message.success('删除成功');
      setSelectedIds([]);
      fetchData();
    } catch { /* request 拦截器已处理 */ }
  };

  const columns: ColumnsType<ClassInfo> = [
    { title: '专业', dataIndex: 'major', width: 150 },
    { title: '年级', dataIndex: 'grade', width: 100 },
    { title: '班级名称', dataIndex: 'className', width: 150 },
    { title: '辅导员ID', dataIndex: 'counselorUserId', width: 120 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete([record.id])}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="major">
          <Input placeholder="专业" allowClear />
        </Form.Item>
        <Form.Item name="grade">
          <Input placeholder="年级" allowClear />
        </Form.Item>
        <Form.Item name="className">
          <Input placeholder="班级名称" allowClear />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            新增班级
          </Button>
          {selectedIds.length > 0 && (
            <Popconfirm title={`确认删除选中的 ${selectedIds.length} 条数据？`} onConfirm={() => handleDelete(selectedIds)}>
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Table<ClassInfo>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={{ selectedRowKeys: selectedIds, onChange: (keys) => setSelectedIds(keys as string[]) }}
        pagination={{
          current: query.current,
          pageSize: query.size,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
        onChange={(p) => setQuery({ ...query, current: p.current, size: p.pageSize })}
        scroll={{ x: 850 }}
      />

      <Modal
        title={editingRecord ? '编辑班级' : '新增班级'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="major" label="专业" rules={[{ required: true, message: '请输入专业' }]}>
            <Input placeholder="如：计算机科学与技术" />
          </Form.Item>
          <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请输入年级' }]}>
            <Input placeholder="如：2023级" />
          </Form.Item>
          <Form.Item name="className" label="班级名称" rules={[{ required: true, message: '请输入班级名称' }]}>
            <Input placeholder="如：计科2301" />
          </Form.Item>
          <Form.Item name="counselorUserId" label="辅导员ID" rules={[{ required: true, message: '请输入辅导员ID' }]}>
            <Input placeholder="辅导员用户ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
