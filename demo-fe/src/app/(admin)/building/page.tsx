'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BuildingInfo, BuildingQuery } from '@/types/building';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Space, Input, Form, Modal, message, Popconfirm } from 'antd';
import { getBuildingPage, addBuilding, updateBuilding, batchDeleteBuildings } from '@/api/Building';

export default function BuildingPage() {
  const [data, setData] = useState<BuildingInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState<BuildingQuery>({ current: 1, size: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BuildingInfo | null>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBuildingPage(query);
      setData(res.records);
      setTotal(res.total);
    } catch { } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (values: BuildingQuery) => {
    setQuery({ ...values, current: 1, size: query.size });
  };

  const handleReset = () => setQuery({ current: 1, size: 10 });

  const openAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: BuildingInfo) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateBuilding({ id: editingRecord.id, ...values });
        message.success('修改成功');
      } else {
        await addBuilding(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await batchDeleteBuildings(ids);
      message.success('删除成功');
      setSelectedIds([]);
      fetchData();
    } catch { }
  };

  const columns: ColumnsType<BuildingInfo> = [
    { title: '楼宇名称', dataIndex: 'buildingName', width: 200 },
    { title: '宿管ID', dataIndex: 'managerUserId', width: 150 },
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
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete([record.id])}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="buildingName">
          <Input placeholder="楼宇名称" allowClear />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>新增楼宇</Button>
          {selectedIds.length > 0 && (
            <Popconfirm title={`确认删除选中的 ${selectedIds.length} 条数据？`} onConfirm={() => handleDelete(selectedIds)}>
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Table<BuildingInfo>
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
        scroll={{ x: 680 }}
      />

      <Modal
        title={editingRecord ? '编辑楼宇' : '新增楼宇'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="buildingName" label="楼宇名称" rules={[{ required: true, message: '请输入楼宇名称' }]}>
            <Input placeholder="如：1号宿舍楼" />
          </Form.Item>
          <Form.Item name="managerUserId" label="宿管ID" rules={[{ required: true, message: '请输入宿管ID' }]}>
            <Input placeholder="宿管用户ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
