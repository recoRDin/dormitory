'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RoomInfo, RoomQuery, BedInfo } from '@/types/room';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Space, Input, InputNumber, Select, Form, Modal, message, Popconfirm, Tag } from 'antd';
import { getRoomPage, addRoom, updateRoom, batchDeleteRooms, getRoomBeds } from '@/api/Room';
import { getBuildingList } from '@/api/Building';
import type { BuildingInfo } from '@/types/building';

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '空闲', color: 'green' },
  1: { label: '占用', color: 'blue' },
  2: { label: '维修', color: 'red' },
};

export default function RoomPage() {
  const [data, setData] = useState<RoomInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState<RoomQuery>({ current: 1, size: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RoomInfo | null>(null);
  const [form] = Form.useForm();
  const [buildings, setBuildings] = useState<BuildingInfo[]>([]);

  const [bedModalOpen, setBedModalOpen] = useState(false);
  const [beds, setBeds] = useState<BedInfo[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRoomPage(query);
      setData(res.records);
      setTotal(res.total);
    } catch { } finally { setLoading(false); }
  }, [query]);

  const fetchBuildings = async () => {
    try {
      const list = await getBuildingList();
      setBuildings(list);
    } catch { }
  };

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchBuildings(); }, []);

  const handleSearch = (values: RoomQuery) => {
    setQuery({ ...values, current: 1, size: query.size });
  };

  const handleReset = () => setQuery({ current: 1, size: 10 });

  const openAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: RoomInfo) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await updateRoom({ id: editingRecord.id, ...values });
        message.success('修改成功');
      } else {
        await addRoom(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchData();
    } catch { }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await batchDeleteRooms(ids);
      message.success('删除成功');
      setSelectedIds([]);
      fetchData();
    } catch { }
  };

  const showBeds = async (roomId: string) => {
    setCurrentRoom(roomId);
    try {
      const bedList = await getRoomBeds(roomId);
      setBeds(bedList);
    } catch { }
    setBedModalOpen(true);
  };

  const columns: ColumnsType<RoomInfo> = [
    { title: '楼宇ID', dataIndex: 'buildingId', width: 100 },
    { title: '楼层', dataIndex: 'floor', width: 80 },
    { title: '房间号', dataIndex: 'roomNo', width: 100 },
    { title: '房型', dataIndex: 'roomType', width: 100 },
    { title: '容量', dataIndex: 'capacity', width: 80 },
    { title: '已入住', dataIndex: 'currentCount', width: 80 },
    {
      title: '床位',
      key: 'beds',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => showBeds(record.id)}>查看床位</Button>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>编辑</Button>
          <Popconfirm title="确认删除？将同时删除该房间所有床位" onConfirm={() => handleDelete([record.id])}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bedColumns: ColumnsType<BedInfo> = [
    { title: '床位号', dataIndex: 'bedNo', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: number) => {
        const s = statusMap[v];
        return s ? <Tag color={s.color}>{s.label}</Tag> : '-';
      },
    },
  ];

  return (
    <div>
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="buildingId">
          <Select
            placeholder="选择楼宇"
            allowClear
            style={{ width: 180 }}
            options={buildings.map((b) => ({ value: b.id, label: b.buildingName }))}
          />
        </Form.Item>
        <Form.Item name="floor">
          <InputNumber placeholder="楼层" style={{ width: 100 }} />
        </Form.Item>
        <Form.Item name="roomNo">
          <Input placeholder="房间号" allowClear />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>新增房间</Button>
          {selectedIds.length > 0 && (
            <Popconfirm title={`确认删除选中的 ${selectedIds.length} 条数据？`} onConfirm={() => handleDelete(selectedIds)}>
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Table<RoomInfo>
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
        scroll={{ x: 900 }}
      />

      <Modal
        title={editingRecord ? '编辑房间' : '新增房间'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="buildingId" label="楼宇" rules={[{ required: true, message: '请选择楼宇' }]}>
            <Select
              placeholder="请选择楼宇"
              options={buildings.map((b) => ({ value: b.id, label: b.buildingName }))}
            />
          </Form.Item>
          <Form.Item name="floor" label="楼层" rules={[{ required: true, message: '请输入楼层' }]}>
            <InputNumber placeholder="楼层" style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="roomNo" label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
            <Input placeholder="如：101" />
          </Form.Item>
          <Form.Item name="roomType" label="房型">
            <Select
              placeholder="请选择房型"
              options={[
                { value: '4人间', label: '4人间' },
                { value: '6人间', label: '6人间' },
                { value: '8人间', label: '8人间' },
              ]}
            />
          </Form.Item>
          <Form.Item name="capacity" label="额定人数" rules={[{ required: true, message: '请输入额定人数' }]}>
            <InputNumber placeholder="额定人数" style={{ width: '100%' }} min={1} max={8} />
          </Form.Item>
          <Form.Item name="headStudentId" label="宿舍长ID">
            <Input placeholder="宿舍长学生ID（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`房间 ${currentRoom} 的床位列表`}
        open={bedModalOpen}
        onCancel={() => setBedModalOpen(false)}
        footer={null}
        width={400}
      >
        <Table<BedInfo>
          rowKey="id"
          columns={bedColumns}
          dataSource={beds}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
}
