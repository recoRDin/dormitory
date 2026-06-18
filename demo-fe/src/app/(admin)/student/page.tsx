'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Student, StudentQuery } from '@/types/student';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import {
  Table, Button, Space, Input, Select, Form,
  Modal, message, Popconfirm, Tag,
} from 'antd';

import {
  getStudentPage,
  addStudent,
  updateStudent,
  batchDeleteStudents,
  assignBed,
  getBedPath,
} from '@/api/Student';

import { getBuildingList } from '@/api/Building';
import { getRoomPage, getRoomBeds } from '@/api/Room';
import { getClassList } from '@/api/Class';

const genderMap: Record<number, { label: string; color: string }> = {
  1: { label: '男', color: 'blue' },
  2: { label: '女', color: 'pink' },
};

export default function StudentPage() {

  const [data, setData] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState<StudentQuery>({ current: 1, size: 10 });

  // 班级列表 classId → 班级名称
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);

  // 床位路径映射 bedId → "1号宿舍楼 101房间 2号床"
  const [dormitoryMap, setDormitoryMap] = useState<Record<string, string>>({});

  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  // 床位分配弹窗
  const [bedModalOpen, setBedModalOpen] = useState(false);
  const [assignStudentId, setAssignStudentId] = useState<string | null>(null);
  const [bedForm] = Form.useForm();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);

  // 加载班级列表
  useEffect(() => {
    getClassList().then((list) => {
      const map: Record<string, string> = {};
      const opts: { value: string; label: string }[] = [];
      list.forEach((c: any) => {
        const name = `${c.grade}${c.className}`;
        map[c.id] = name;
        opts.push({ value: c.id, label: name });
      });
      setClassMap(map);
      setClassOptions(opts);
    }).catch(() => {});
  }, []);

  // 请求数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudentPage(query);
      setData(res.records);
      setTotal(res.total);

      // 批量加载床位路径
      const bedIds = [...new Set(res.records.map((s: Student) => s.bedId).filter(Boolean))] as string[];
      const paths = await Promise.all(bedIds.map((id) => getBedPath(id).catch(() => '')));
      const map: Record<string, string> = {};
      bedIds.forEach((id, i) => { if (paths[i]) map[id] = paths[i]; });
      setDormitoryMap(map);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 搜索
  const handleSearch = (values: StudentQuery) => {
    setQuery({ ...values, current: 1, size: query.size });
  };

  const handleReset = () => {
    setQuery({ current: 1, size: 10 });
  };

  // ==================== 新增/编辑弹窗 ====================
  const openAddModal = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        await updateStudent({ id: editingStudent.id, ...values });
        message.success('修改成功');
      } else {
        await addStudent(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      // 表单验证失败无需处理，API 错误已在 request 拦截器中提示
    }
  };

  // ==================== 删除 ====================
  const handleDelete = async (ids: string[]) => {
    try {
      await batchDeleteStudents(ids);
      message.success('删除成功');
      setSelectedIds([]);
      fetchData();
    } catch {
    }
  };

  // ==================== 分页 ====================
  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    setQuery({ ...query, current: pagination.current, size: pagination.pageSize });
  };

  // ==================== 床位分配弹窗 ====================
  const openBedModal = async (studentId: string) => {
    setAssignStudentId(studentId);
    bedForm.resetFields();
    setRooms([]);
    setBeds([]);
    try {
      const list = await getBuildingList();
      setBuildings(list);
    } catch { }
    setBedModalOpen(true);
  };

  const handleBuildingChange = async (buildingId: string) => {
    bedForm.setFieldsValue({ roomId: undefined, bedId: undefined });
    setBeds([]);
    try {
      const res = await getRoomPage({ buildingId, current: 1, size: 100 });
      setRooms(res.records);
    } catch { }
  };

  const handleRoomChange = async (roomId: string) => {
    bedForm.setFieldsValue({ bedId: undefined });
    try {
      const bedList = await getRoomBeds(roomId);
      setBeds(bedList.filter((b: any) => b.status === 0));
    } catch { }
  };

  const handleBedAssign = async () => {
    try {
      const values = await bedForm.validateFields();
      await assignBed({ studentId: assignStudentId!, targetBedId: values.bedId });
      message.success('分配成功');
      setBedModalOpen(false);
      fetchData();
    } catch { }
  };

  // ==================== 表格列定义 ====================
  const columns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'studentNo',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      render: (val: number) => {
        const g = genderMap[val];
        return g ? <Tag color={g.color}>{g.label}</Tag> : '-';
      },
    },
    {
      title: '班级',
      dataIndex: 'classId',
      width: 130,
      render: (id: string) => classMap[id] || id,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '住宿信息',
      key: 'dormitory',
      width: 200,
      render: (_: unknown, record: Student) => {
        if (!record.bedId) return <Tag>未分配</Tag>;
        return dormitoryMap[record.bedId] || '加载中...';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => openBedModal(record.id)}
          >
            分配床位
          </Button>
          <Popconfirm
            title="确认删除该学生？"
            onConfirm={() => handleDelete([record.id])}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==================== 渲染 ====================
  return (
    <div>
      {/* 搜索栏 */}
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="studentNo">
          <Input placeholder="学号" allowClear />
        </Form.Item>
        <Form.Item name="name">
          <Input placeholder="姓名" allowClear />
        </Form.Item>
        <Form.Item name="gender">
          <Select
            placeholder="性别"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 1, label: '男' },
              { value: 2, label: '女' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            新增学生
          </Button>
          {selectedIds.length > 0 && (
            <Popconfirm
              title={`确认删除选中的 ${selectedIds.length} 条数据？`}
              onConfirm={() => handleDelete(selectedIds)}
            >
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      {/* 数据表格 */}
      <Table<Student>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => setSelectedIds(keys as string[]),
        }}
        pagination={{
          current: query.current,
          pageSize: query.size,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
        onChange={(pagination) =>
          handleTableChange({
            current: pagination.current,
            pageSize: pagination.pageSize,
          })
        }
        scroll={{ x: 1100 }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingStudent ? '编辑学生' : '新增学生'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="studentNo"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input placeholder="请输入学号" />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 1, label: '男' },
                { value: 2, label: '女' },
              ]}
            />
          </Form.Item>
          <Form.Item name="idCard" label="身份证号">
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="classId"
            label="班级"
            rules={[{ required: true, message: '请选择班级' }]}
          >
            <Select
              placeholder="请选择班级"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={classOptions}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 床位分配弹窗 */}
      <Modal
        title="分配床位"
        open={bedModalOpen}
        onOk={handleBedAssign}
        onCancel={() => setBedModalOpen(false)}
        destroyOnClose
      >
        <Form form={bedForm} layout="vertical">
          <Form.Item name="buildingId" label="楼宇" rules={[{ required: true, message: '请选择楼宇' }]}>
            <Select
              placeholder="请选择楼宇"
              onChange={handleBuildingChange}
              options={buildings.map((b: any) => ({ value: b.id, label: b.buildingName }))}
            />
          </Form.Item>
          <Form.Item name="roomId" label="房间" rules={[{ required: true, message: '请选择房间' }]}>
            <Select
              placeholder="请选择房间"
              onChange={handleRoomChange}
              disabled={!bedForm.getFieldValue('buildingId')}
              options={rooms.map((r: any) => ({ value: r.id, label: `${r.roomNo}（${r.currentCount}/${r.capacity}）` }))}
            />
          </Form.Item>
          <Form.Item name="bedId" label="床位" rules={[{ required: true, message: '请选择床位' }]}>
            <Select
              placeholder="请选择床位"
              disabled={!bedForm.getFieldValue('roomId')}
              options={beds.map((b: any) => ({ value: b.id, label: `${b.bedNo}号床（空闲）` }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
