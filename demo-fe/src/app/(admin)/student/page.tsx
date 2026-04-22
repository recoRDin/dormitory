'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Student, StudentQuery, StudentSave } from '@/types/student';
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
} from '@/api/Student';

// 性别映射
const genderMap: Record<number, { label: string; color: string }> = {
  1: { label: '男', color: 'blue' },
  2: { label: '女', color: 'pink' },
};

export default function StudentPage(){

  const[data,setData] = useState<Student[]>([]);//表格数据
  const[total,setTotal] = useState(0);//总条数
  const[loading,setLoading] = useState(false);//加载状态
  const[selectedIds,setSelectedIds] = useState<number[]>([]);//批量选中

  //搜索条件
  const [query, setQuery] = useState<StudentQuery>({ current: 1, size: 10 });

  // 弹窗相关
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();


  //请求数据
  const fetchData = useCallback(async() => {
    setLoading(true);
    try{
      const res = await getStudentPage(query);
      setData(res.records);
      setTotal(res.total);
    }catch{
      //错误在request抛出
    }finally{
      setLoading(false);
    }
  },[query]);

  useEffect(() => {
    fetchData();
  },[fetchData]);

  //搜索
  const handleSearch = (values:StudentQuery) => {
    setQuery({...values,current:1,size:query.size});
  }

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
          // 编辑
          await updateStudent({ ...values, id: editingStudent.id });
          message.success('修改成功');
        } else {
          // 新增
          await addStudent(values);
          message.success('新增成功');
        }
        setModalOpen(false);
        fetchData(); // 刷新列表
      } catch {
        // 表单校验失败 或 接口报错，不关弹窗
      }
  };
  
    // ==================== 删除 ====================
  const handleDelete = async (ids: (number | string)[]) => {
      try {
        await batchDeleteStudents(ids);
        message.success('删除成功');
        setSelectedIds([]);
        fetchData(); // 刷新列表
      } catch {
        // 错误已在拦截器处理
      }
    };
  
    // ==================== 分页 ====================
    const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
      setQuery({ ...query, current: pagination.current, size: pagination.pageSize });
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
        title: '身份证号',
        dataIndex: 'idCard',
        width: 180,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 130,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 180,
      },
      {
        title: '班级ID',
        dataIndex: 'classId',
        width: 90,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
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
              <Button type="primary" htmlType="submit">
                查询
              </Button>
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
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
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
            onChange: (keys) => setSelectedIds(keys as number[]),
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
              label="班级ID"
              rules={[{ required: true, message: '请输入班级ID' }]}
            >
              <Input placeholder="请输入班级ID" type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

