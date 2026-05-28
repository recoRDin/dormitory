# Week 1: 基础数据管理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成班级管理、楼宇管理、房间管理（含床位自动创建）的后端 + 前端，清理遗留代码，建立完整数据链条。

**Architecture:** 遵循现有分层模式 — 每个业务模块在 `biz/<module>/` 下按 entity → mapper → dto → service → controller 六层结构组织。前端每个模块对应 `api/` + `types/` + `app/(admin)/<module>/page.tsx`。

**Tech Stack:** Spring Boot 3.5.11 + MyBatis-Plus 3.5.5 + Next.js 15.3 + Ant Design 6 + TypeScript

---

### Task 1: 清理遗留代码

**Files:**
- Delete: `demo-be/src/main/java/com/example/demo/common/utils/MockDataUtil.java`
- Delete: `demo-be/src/main/java/com/example/demo/system/test/controller/StudentTestController.java`

- [ ] **Step 1: 删除两个文件**

```bash
rm demo-be/src/main/java/com/example/demo/common/utils/MockDataUtil.java
rm demo-be/src/main/java/com/example/demo/system/test/controller/StudentTestController.java
```

- [ ] **Step 2: 验证后端编译通过**

```bash
cd demo-be && ./mvnw compile -q
```

Expected: BUILD SUCCESS

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "chore: 清理遗留测试代码（MockDataUtil、StudentTestController）"
```

---

### Task 2: 班级管理 — 后端 Entity + Mapper

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/entity/Class.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/mapper/ClassMapper.java`

- [ ] **Step 1: 创建 Class 实体**

```java
package com.example.demo.biz.classs.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_class")
@EqualsAndHashCode(callSuper = true)
public class Class extends BaseEntity {

    @TableId
    private Long id;

    private String major;

    private String grade;

    private String className;

    private Long counselorUserId;

    private String tenantId;
}
```

- [ ] **Step 2: 创建 ClassMapper**

```java
package com.example.demo.biz.classs.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.biz.classs.entity.Class;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ClassMapper extends BaseMapper<Class> {
}
```

- [ ] **Step 3: 编译验证**

```bash
cd demo-be && ./mvnw compile -q
```

- [ ] **Step 4: 提交**

```bash
git add demo-be/src/main/java/com/example/demo/biz/classs/
git commit -m "feat: 班级管理 — Entity + Mapper"
```

---

### Task 3: 班级管理 — DTO

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/dto/ClassSaveDTO.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/dto/ClassQueryDTO.java`

- [ ] **Step 1: 创建 ClassSaveDTO**

```java
package com.example.demo.biz.classs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassSaveDTO {

    private Long id;

    @NotBlank(message = "专业不能为空")
    private String major;

    @NotBlank(message = "年级不能为空")
    private String grade;

    @NotBlank(message = "班级名称不能为空")
    private String className;

    @NotNull(message = "辅导员不能为空")
    private Long counselorUserId;
}
```

- [ ] **Step 2: 创建 ClassQueryDTO**

```java
package com.example.demo.biz.classs.dto;

import lombok.Data;

@Data
public class ClassQueryDTO {

    private String major;

    private String grade;

    private String className;

    private Integer current = 1;

    private Integer size = 10;
}
```

- [ ] **Step 3: 编译验证**

```bash
cd demo-be && ./mvnw compile -q
```

- [ ] **Step 4: 提交**

```bash
git add demo-be/src/main/java/com/example/demo/biz/classs/dto/
git commit -m "feat: 班级管理 — SaveDTO + QueryDTO"
```

---

### Task 4: 班级管理 — Service

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/service/IClassService.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/service/impl/ClassServiceImpl.java`

- [ ] **Step 1: 创建 IClassService 接口**

```java
package com.example.demo.biz.classs.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;

import java.util.List;

public interface IClassService extends IService<Class> {

    IPage<Class> pageList(ClassQueryDTO queryDTO);

    Long addClass(ClassSaveDTO saveDTO);

    void updateClass(ClassSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Class> listAll();
}
```

- [ ] **Step 2: 创建 ClassServiceImpl 实现**

```java
package com.example.demo.biz.classs.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;
import com.example.demo.biz.classs.mapper.ClassMapper;
import com.example.demo.biz.classs.service.IClassService;
import com.example.demo.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl extends ServiceImpl<ClassMapper, Class> implements IClassService {

    private final ClassMapper classMapper;

    @Override
    public IPage<Class> pageList(ClassQueryDTO queryDTO) {
        Page<Class> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        LambdaQueryWrapper<Class> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .like(queryDTO.getMajor() != null, Class::getMajor, queryDTO.getMajor())
                .like(queryDTO.getGrade() != null, Class::getGrade, queryDTO.getGrade())
                .like(queryDTO.getClassName() != null, Class::getClassName, queryDTO.getClassName())
                .orderByDesc(Class::getCreateTime);
        return classMapper.selectPage(page, wrapper);
    }

    @Override
    public Long addClass(ClassSaveDTO saveDTO) {
        Class entity = new Class();
        BeanUtils.copyProperties(saveDTO, entity);
        classMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public void updateClass(ClassSaveDTO saveDTO) {
        Class entity = new Class();
        BeanUtils.copyProperties(saveDTO, entity);
        classMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            classMapper.deleteById(id);
        }
    }

    @Override
    public List<Class> listAll() {
        return lambdaQuery()
                .orderByAsc(Class::getGrade)
                .orderByAsc(Class::getClassName)
                .list();
    }
}
```

- [ ] **Step 3: 编译验证**

```bash
cd demo-be && ./mvnw compile -q
```

- [ ] **Step 4: 提交**

```bash
git add demo-be/src/main/java/com/example/demo/biz/classs/service/
git commit -m "feat: 班级管理 — Service 层"
```

---

### Task 5: 班级管理 — Controller

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/classs/controller/ClassController.java`

- [ ] **Step 1: 创建 ClassController**

```java
package com.example.demo.biz.classs.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;
import com.example.demo.biz.classs.service.IClassService;
import com.example.demo.common.api.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/class")
@RequiredArgsConstructor
public class ClassController {

    private final IClassService classService;

    @GetMapping("/page")
    public Result<IPage<Class>> pageList(ClassQueryDTO queryDTO) {
        return Result.success(classService.pageList(queryDTO));
    }

    @GetMapping("/list")
    public Result<List<Class>> listAll() {
        return Result.success(classService.listAll());
    }

    @PostMapping
    public Result<Long> add(@Valid @RequestBody ClassSaveDTO saveDTO) {
        return Result.success(classService.addClass(saveDTO));
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody ClassSaveDTO saveDTO) {
        classService.updateClass(saveDTO);
        return Result.success();
    }

    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        classService.batchDelete(idList);
        return Result.success();
    }
}
```

- [ ] **Step 2: 编译验证**

```bash
cd demo-be && ./mvnw compile -q
```

- [ ] **Step 3: 提交**

```bash
git add demo-be/src/main/java/com/example/demo/biz/classs/controller/
git commit -m "feat: 班级管理 — Controller"
```

---

### Task 6: 班级管理 — 前端

**Files:**
- Create: `demo-fe/src/types/class.ts`
- Create: `demo-fe/src/api/Class.ts`
- Create: `demo-fe/src/app/(admin)/class/page.tsx`
- Modify: `demo-fe/src/components/AdminLayout.tsx`

- [ ] **Step 1: 创建类型定义**

```typescript
// demo-fe/src/types/class.ts

export interface ClassInfo {
  id: string;
  major: string;
  grade: string;
  className: string;
  counselorUserId: string;
  createTime: string;
  updateTime: string;
}

export interface ClassSave {
  id?: string;
  major: string;
  grade: string;
  className: string;
  counselorUserId: string;
}

export interface ClassQuery {
  major?: string;
  grade?: string;
  className?: string;
  current?: number;
  size?: number;
}
```

- [ ] **Step 2: 创建 API 封装**

```typescript
// demo-fe/src/api/Class.ts

import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { ClassInfo, ClassQuery, ClassSave } from '@/types/class';

export function getClassPage(params: ClassQuery) {
  return request.get<PageResult<ClassInfo>>('/class/page', { params });
}

export function getClassList() {
  return request.get<ClassInfo[]>('/class/list');
}

export function addClass(data: ClassSave) {
  return request.post<string>('/class', data);
}

export function updateClass(data: ClassSave) {
  return request.put<void>('/class', data);
}

export function batchDeleteClasses(ids: string[]) {
  return request.delete<void>('/class', { params: { ids: ids.join(',') } });
}
```

- [ ] **Step 3: 创建班级管理页面**

```typescript
// demo-fe/src/app/(admin)/class/page.tsx

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
```

- [ ] **Step 4: 更新侧边栏导航**

Edit `demo-fe/src/components/AdminLayout.tsx` — 在 `sideMenuItems` 数组中加入班级管理菜单项：

```typescript
// 在 import 中增加 TeamOutlined
import {
  HomeOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';

// 在 sideMenuItems 中增加
{
  key: '/class',
  icon: <TeamOutlined />,
  label: '班级管理',
},
```

- [ ] **Step 5: 验证前端编译通过**

```bash
cd demo-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: 提交**

```bash
git add demo-fe/src/types/class.ts demo-fe/src/api/Class.ts demo-fe/src/app/\(admin\)/class/ demo-fe/src/components/AdminLayout.tsx
git commit -m "feat: 班级管理 — 前端页面 + 导航"
```

---

### Task 7: 楼宇管理 — 后端 Entity + Mapper + DTO

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/building/entity/Building.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/building/mapper/BuildingMapper.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/building/dto/BuildingSaveDTO.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/building/dto/BuildingQueryDTO.java`

- [ ] **Step 1: 创建 Building 实体**

```java
package com.example.demo.biz.building.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_building")
@EqualsAndHashCode(callSuper = true)
public class Building extends BaseEntity {

    @TableId
    private Long id;

    private String buildingName;

    private Long managerUserId;

    private String tenantId;
}
```

- [ ] **Step 2: 创建 BuildingMapper**

```java
package com.example.demo.biz.building.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.biz.building.entity.Building;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BuildingMapper extends BaseMapper<Building> {
}
```

- [ ] **Step 3: 创建 BuildingSaveDTO**

```java
package com.example.demo.biz.building.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BuildingSaveDTO {

    private Long id;

    @NotBlank(message = "楼宇名称不能为空")
    private String buildingName;

    @NotNull(message = "宿管不能为空")
    private Long managerUserId;
}
```

- [ ] **Step 4: 创建 BuildingQueryDTO**

```java
package com.example.demo.biz.building.dto;

import lombok.Data;

@Data
public class BuildingQueryDTO {

    private String buildingName;

    private Integer current = 1;

    private Integer size = 10;
}
```

- [ ] **Step 5: 编译验证后提交**

```bash
cd demo-be && ./mvnw compile -q
git add demo-be/src/main/java/com/example/demo/biz/building/
git commit -m "feat: 楼宇管理 — Entity + Mapper + DTO"
```

---

### Task 8: 楼宇管理 — Service + Controller

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/building/service/IBuildingService.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/building/service/impl/BuildingServiceImpl.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/building/controller/BuildingController.java`

- [ ] **Step 1: 创建 IBuildingService 接口**

```java
package com.example.demo.biz.building.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;

import java.util.List;

public interface IBuildingService extends IService<Building> {

    IPage<Building> pageList(BuildingQueryDTO queryDTO);

    Long addBuilding(BuildingSaveDTO saveDTO);

    void updateBuilding(BuildingSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Building> listAll();
}
```

- [ ] **Step 2: 创建 BuildingServiceImpl 实现**

```java
package com.example.demo.biz.building.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;
import com.example.demo.biz.building.mapper.BuildingMapper;
import com.example.demo.biz.building.service.IBuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingServiceImpl extends ServiceImpl<BuildingMapper, Building> implements IBuildingService {

    private final BuildingMapper buildingMapper;

    @Override
    public IPage<Building> pageList(BuildingQueryDTO queryDTO) {
        Page<Building> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        LambdaQueryWrapper<Building> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .like(queryDTO.getBuildingName() != null, Building::getBuildingName, queryDTO.getBuildingName())
                .orderByDesc(Building::getCreateTime);
        return buildingMapper.selectPage(page, wrapper);
    }

    @Override
    public Long addBuilding(BuildingSaveDTO saveDTO) {
        Building entity = new Building();
        BeanUtils.copyProperties(saveDTO, entity);
        buildingMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public void updateBuilding(BuildingSaveDTO saveDTO) {
        Building entity = new Building();
        BeanUtils.copyProperties(saveDTO, entity);
        buildingMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            buildingMapper.deleteById(id);
        }
    }

    @Override
    public List<Building> listAll() {
        return lambdaQuery()
                .orderByAsc(Building::getBuildingName)
                .list();
    }
}
```

- [ ] **Step 3: 创建 BuildingController**

```java
package com.example.demo.biz.building.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;
import com.example.demo.biz.building.service.IBuildingService;
import com.example.demo.common.api.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/building")
@RequiredArgsConstructor
public class BuildingController {

    private final IBuildingService buildingService;

    @GetMapping("/page")
    public Result<IPage<Building>> pageList(BuildingQueryDTO queryDTO) {
        return Result.success(buildingService.pageList(queryDTO));
    }

    @GetMapping("/list")
    public Result<List<Building>> listAll() {
        return Result.success(buildingService.listAll());
    }

    @PostMapping
    public Result<Long> add(@Valid @RequestBody BuildingSaveDTO saveDTO) {
        return Result.success(buildingService.addBuilding(saveDTO));
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody BuildingSaveDTO saveDTO) {
        buildingService.updateBuilding(saveDTO);
        return Result.success();
    }

    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        buildingService.batchDelete(idList);
        return Result.success();
    }
}
```

- [ ] **Step 4: 编译验证后提交**

```bash
cd demo-be && ./mvnw compile -q
git add demo-be/src/main/java/com/example/demo/biz/building/
git commit -m "feat: 楼宇管理 — Service + Controller"
```

---

### Task 9: 楼宇管理 — 前端

**Files:**
- Create: `demo-fe/src/types/building.ts`
- Create: `demo-fe/src/api/Building.ts`
- Create: `demo-fe/src/app/(admin)/building/page.tsx`
- Modify: `demo-fe/src/components/AdminLayout.tsx`

- [ ] **Step 1: 创建类型定义**

```typescript
// demo-fe/src/types/building.ts

export interface BuildingInfo {
  id: string;
  buildingName: string;
  managerUserId: string;
  createTime: string;
  updateTime: string;
}

export interface BuildingSave {
  id?: string;
  buildingName: string;
  managerUserId: string;
}

export interface BuildingQuery {
  buildingName?: string;
  current?: number;
  size?: number;
}
```

- [ ] **Step 2: 创建 API 封装**

```typescript
// demo-fe/src/api/Building.ts

import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { BuildingInfo, BuildingQuery, BuildingSave } from '@/types/building';

export function getBuildingPage(params: BuildingQuery) {
  return request.get<PageResult<BuildingInfo>>('/building/page', { params });
}

export function getBuildingList() {
  return request.get<BuildingInfo[]>('/building/list');
}

export function addBuilding(data: BuildingSave) {
  return request.post<string>('/building', data);
}

export function updateBuilding(data: BuildingSave) {
  return request.put<void>('/building', data);
}

export function batchDeleteBuildings(ids: string[]) {
  return request.delete<void>('/building', { params: { ids: ids.join(',') } });
}
```

- [ ] **Step 3: 创建楼宇管理页面**

```typescript
// demo-fe/src/app/(admin)/building/page.tsx

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
```

- [ ] **Step 4: 更新侧边栏导航**

Edit `demo-fe/src/components/AdminLayout.tsx` — 在 import 中加入 `BankOutlined`，在 `sideMenuItems` 中加入：

```typescript
{
  key: '/building',
  icon: <BankOutlined />,
  label: '楼宇管理',
},
```

- [ ] **Step 5: 验证前端编译通过**

```bash
cd demo-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: 提交**

```bash
git add demo-fe/src/types/building.ts demo-fe/src/api/Building.ts demo-fe/src/app/\(admin\)/building/ demo-fe/src/components/AdminLayout.tsx
git commit -m "feat: 楼宇管理 — 前端页面 + 导航"
```

---

### Task 10: 房间管理 — 后端 Entity + Mapper + DTO（含 Bed Mapper）

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/room/entity/Room.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/room/mapper/RoomMapper.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/room/dto/RoomSaveDTO.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/room/dto/RoomQueryDTO.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/bed/entity/Bed.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/bed/mapper/BedMapper.java`

- [ ] **Step 1: 创建 Room 实体**

```java
package com.example.demo.biz.room.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_room")
@EqualsAndHashCode(callSuper = true)
public class Room extends BaseEntity {

    @TableId
    private Long id;

    private Long buildingId;

    private Integer floor;

    private String roomNo;

    private String roomType;

    private Integer capacity;

    private Integer currentCount;

    private Long headStudentId;

    private String tenantId;
}
```

- [ ] **Step 2: 创建 RoomMapper**

```java
package com.example.demo.biz.room.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.biz.room.entity.Room;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoomMapper extends BaseMapper<Room> {
}
```

- [ ] **Step 3: 创建 RoomSaveDTO**

```java
package com.example.demo.biz.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomSaveDTO {

    private Long id;

    @NotNull(message = "楼宇不能为空")
    private Long buildingId;

    @NotNull(message = "楼层不能为空")
    private Integer floor;

    @NotBlank(message = "房间号不能为空")
    private String roomNo;

    private String roomType;

    @NotNull(message = "额定人数不能为空")
    private Integer capacity;

    private Long headStudentId;
}
```

- [ ] **Step 4: 创建 RoomQueryDTO**

```java
package com.example.demo.biz.room.dto;

import lombok.Data;

@Data
public class RoomQueryDTO {

    private Long buildingId;

    private Integer floor;

    private String roomNo;

    private Integer current = 1;

    private Integer size = 10;
}
```

- [ ] **Step 5: 创建 Bed 实体（后续床位分配和卫生检查都要用）**

```java
package com.example.demo.biz.bed.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_bed")
@EqualsAndHashCode(callSuper = true)
public class Bed extends BaseEntity {

    @TableId
    private Long id;

    private Long roomId;

    private Integer bedNo;

    /** 0-空闲 1-占用 2-维修 */
    private Integer status;

    private String tenantId;
}
```

- [ ] **Step 6: 创建 BedMapper**

```java
package com.example.demo.biz.bed.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.biz.bed.entity.Bed;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BedMapper extends BaseMapper<Bed> {
}
```

- [ ] **Step 7: 编译验证后提交**

```bash
cd demo-be && ./mvnw compile -q
git add demo-be/src/main/java/com/example/demo/biz/room/ demo-be/src/main/java/com/example/demo/biz/bed/
git commit -m "feat: 房间管理 + 床位 — Entity + Mapper + DTO"
```

---

### Task 11: 房间管理 — Service（含床位自动创建 + 级联删除）

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/room/service/IRoomService.java`
- Create: `demo-be/src/main/java/com/example/demo/biz/room/service/impl/RoomServiceImpl.java`

- [ ] **Step 1: 创建 IRoomService 接口**

```java
package com.example.demo.biz.room.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;

import java.util.List;

public interface IRoomService extends IService<Room> {

    IPage<Room> pageList(RoomQueryDTO queryDTO);

    Long addRoom(RoomSaveDTO saveDTO);

    void updateRoom(RoomSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Bed> getBedsByRoomId(Long roomId);
}
```

- [ ] **Step 2: 创建 RoomServiceImpl 实现**

```java
package com.example.demo.biz.room.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.bed.mapper.BedMapper;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.mapper.RoomMapper;
import com.example.demo.biz.room.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl extends ServiceImpl<RoomMapper, Room> implements IRoomService {

    private final RoomMapper roomMapper;
    private final BedMapper bedMapper;

    @Override
    public IPage<Room> pageList(RoomQueryDTO queryDTO) {
        Page<Room> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        LambdaQueryWrapper<Room> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .eq(queryDTO.getBuildingId() != null, Room::getBuildingId, queryDTO.getBuildingId())
                .eq(queryDTO.getFloor() != null, Room::getFloor, queryDTO.getFloor())
                .like(queryDTO.getRoomNo() != null, Room::getRoomNo, queryDTO.getRoomNo())
                .orderByAsc(Room::getBuildingId)
                .orderByAsc(Room::getFloor)
                .orderByAsc(Room::getRoomNo);
        return roomMapper.selectPage(page, wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addRoom(RoomSaveDTO saveDTO) {
        Room room = new Room();
        BeanUtils.copyProperties(saveDTO, room);
        room.setCurrentCount(0);
        roomMapper.insert(room);

        // 根据容量自动批量创建床位
        List<Bed> beds = new ArrayList<>();
        for (int i = 1; i <= saveDTO.getCapacity(); i++) {
            Bed bed = new Bed();
            bed.setRoomId(room.getId());
            bed.setBedNo(i);
            bed.setStatus(0);
            beds.add(bed);
        }
        if (!beds.isEmpty()) {
            for (Bed bed : beds) {
                bedMapper.insert(bed);
            }
        }

        return room.getId();
    }

    @Override
    public void updateRoom(RoomSaveDTO saveDTO) {
        Room room = new Room();
        BeanUtils.copyProperties(saveDTO, room);
        roomMapper.updateById(room);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            // 级联删除该房间下所有床位
            LambdaQueryWrapper<Bed> bedWrapper = new LambdaQueryWrapper<>();
            bedWrapper.eq(Bed::getRoomId, id);
            bedMapper.delete(bedWrapper);

            roomMapper.deleteById(id);
        }
    }

    @Override
    public List<Bed> getBedsByRoomId(Long roomId) {
        LambdaQueryWrapper<Bed> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Bed::getRoomId, roomId)
                .orderByAsc(Bed::getBedNo);
        return bedMapper.selectList(wrapper);
    }
}
```

- [ ] **Step 3: 编译验证后提交**

```bash
cd demo-be && ./mvnw compile -q
git add demo-be/src/main/java/com/example/demo/biz/room/service/
git commit -m "feat: 房间管理 — Service（床位自动创建 + 级联删除）"
```

---

### Task 12: 房间管理 — Controller

**Files:**
- Create: `demo-be/src/main/java/com/example/demo/biz/room/controller/RoomController.java`

- [ ] **Step 1: 创建 RoomController**

```java
package com.example.demo.biz.room.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.service.IRoomService;
import com.example.demo.common.api.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final IRoomService roomService;

    @GetMapping("/page")
    public Result<IPage<Room>> pageList(RoomQueryDTO queryDTO) {
        return Result.success(roomService.pageList(queryDTO));
    }

    @PostMapping
    public Result<Long> add(@Valid @RequestBody RoomSaveDTO saveDTO) {
        return Result.success(roomService.addRoom(saveDTO));
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody RoomSaveDTO saveDTO) {
        roomService.updateRoom(saveDTO);
        return Result.success();
    }

    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        roomService.batchDelete(idList);
        return Result.success();
    }

    @GetMapping("/{id}/beds")
    public Result<List<Bed>> getBeds(@PathVariable Long id) {
        return Result.success(roomService.getBedsByRoomId(id));
    }
}
```

- [ ] **Step 2: 编译验证后提交**

```bash
cd demo-be && ./mvnw compile -q
git add demo-be/src/main/java/com/example/demo/biz/room/controller/
git commit -m "feat: 房间管理 — Controller"
```

---

### Task 13: 房间管理 — 前端

**Files:**
- Create: `demo-fe/src/types/room.ts`
- Create: `demo-fe/src/api/Room.ts`
- Create: `demo-fe/src/app/(admin)/room/page.tsx`
- Modify: `demo-fe/src/components/AdminLayout.tsx`

- [ ] **Step 1: 创建类型定义**

```typescript
// demo-fe/src/types/room.ts

export interface RoomInfo {
  id: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  roomType: string;
  capacity: number;
  currentCount: number;
  headStudentId: string | null;
  createTime: string;
  updateTime: string;
}

export interface BedInfo {
  id: string;
  roomId: string;
  bedNo: number;
  status: number;
}

export interface RoomSave {
  id?: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  roomType?: string;
  capacity: number;
  headStudentId?: string;
}

export interface RoomQuery {
  buildingId?: string;
  floor?: number;
  roomNo?: string;
  current?: number;
  size?: number;
}
```

- [ ] **Step 2: 创建 API 封装**

```typescript
// demo-fe/src/api/Room.ts

import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { RoomInfo, RoomQuery, RoomSave, BedInfo } from '@/types/room';

export function getRoomPage(params: RoomQuery) {
  return request.get<PageResult<RoomInfo>>('/room/page', { params });
}

export function addRoom(data: RoomSave) {
  return request.post<string>('/room', data);
}

export function updateRoom(data: RoomSave) {
  return request.put<void>('/room', data);
}

export function batchDeleteRooms(ids: string[]) {
  return request.delete<void>('/room', { params: { ids: ids.join(',') } });
}

export function getRoomBeds(roomId: string) {
  return request.get<BedInfo[]>(`/room/${roomId}/beds`);
}
```

- [ ] **Step 3: 创建房间管理页面**

```typescript
// demo-fe/src/app/(admin)/room/page.tsx

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

  // 床位弹窗
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
```

- [ ] **Step 4: 更新侧边栏导航**

Edit `demo-fe/src/components/AdminLayout.tsx` — 在 import 中加入 `HomeFilled`（或 `AppstoreOutlined`），在 `sideMenuItems` 中加入：

```typescript
{
  key: '/room',
  icon: <AppstoreOutlined />,
  label: '房间管理',
},
```

同时需要 import `AppstoreOutlined` from `@ant-design/icons`。

- [ ] **Step 5: 验证前端编译通过**

```bash
cd demo-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: 提交**

```bash
git add demo-fe/src/types/room.ts demo-fe/src/api/Room.ts demo-fe/src/app/\(admin\)/room/ demo-fe/src/components/AdminLayout.tsx
git commit -m "feat: 房间管理 — 前端页面（含床位查看）"
```

---

### Task 14: 导航完整更新 — 确保所有菜单项正确

**Files:**
- Modify: `demo-fe/src/components/AdminLayout.tsx`

- [ ] **Step 1: 确认 AdminLayout 最终状态**

所有 `sideMenuItems` 应包含：

```typescript
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const sideMenuItems: MenuProps['items'] = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/student', icon: <UserOutlined />, label: '学生管理' },
  { key: '/class', icon: <TeamOutlined />, label: '班级管理' },
  { key: '/building', icon: <BankOutlined />, label: '楼宇管理' },
  { key: '/room', icon: <AppstoreOutlined />, label: '房间管理' },
];
```

- [ ] **Step 2: 验证前端编译通过**

```bash
cd demo-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: 提交**

```bash
git add demo-fe/src/components/AdminLayout.tsx
git commit -m "feat: 侧边栏导航 — 增加班级/楼宇/房间管理菜单"
```

---

## 验证清单

完成所有 Task 后：

1. 启动后端：`cd demo-be && ./mvnw spring-boot:run`
2. 启动前端：`cd demo-fe && pnpm dev`
3. 端到端测试：
   - 创建班级 → 创建楼宇 → 创建房间（验证床位自动生成）→ 查看床位列表
   - 编辑/删除班级、楼宇、房间
   - 确认侧边栏所有菜单项可点击跳转
