# 宿舍管理系统 - 学生模块 API 接口文档

## 文档信息
- **模块名称**: 学生管理模块
- **文档版本**: v1.1
- **最后更新**: 2026-04-18
- **后端框架**: Spring Boot 3.5.11 + MyBatis-Plus 3.5.5
- **前端框架**: Next.js 16.2.3 + TypeScript + Ant Design
- **数据库**: MySQL 8.0+（无外键约束）

## 接口概览

| 接口名称 | 请求方法 | 路径 | 功能描述 | 权限要求 |
|---------|---------|------|---------|----------|
| 分页查询学生列表 | GET | `/api/student/page` | 分页查询学生信息，支持多条件筛选 | `student:view` |
| 新增学生信息 | POST | `/api/student` | 创建新的学生记录 | `student:add` |
| 修改学生基础信息 | PUT | `/api/student` | 根据ID更新学生基础信息 | `student:edit` |
| 分配/调换床位 | POST | `/api/student/assign-bed` | 为学生分配或调换床位 | `student:assignBed` |
| 批量逻辑删除学生 | DELETE | `/api/student` | 批量逻辑删除学生记录 | `student:delete` |

## 数据表结构
```sql
CREATE TABLE `biz_student` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `student_no` VARCHAR(20) NOT NULL COMMENT '学号',
  `name` VARCHAR(50) NOT NULL,
  `gender` TINYINT(1) NOT NULL COMMENT '1-男, 2-女',
  `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `class_id` BIGINT NOT NULL COMMENT '班级ID',
  `bed_id` BIGINT DEFAULT NULL COMMENT '当前床位ID',
  `user_id` BIGINT DEFAULT NULL COMMENT '关联账号ID',
  `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_tenant` (`student_no`, `tenant_id`)
) COMMENT='学生信息表';
```

## 1. 分页查询学生列表

### 基本信息
- **请求方法**: GET
- **路径**: `/api/student/page`
- **权限要求**: `student:view`
- **功能描述**: 分页查询学生列表，支持多条件筛选

### 请求参数（Query Parameters）

| 参数名 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| current | Integer | 否 | 当前页码，默认1 | 1 |
| size | Integer | 否 | 每页条数，默认10 | 10 |
| name | String | 否 | 学生姓名（模糊查询） | 张三 |
| studentNo | String | 否 | 学号（模糊查询） | 202301001 |
| classId | Long | 否 | 班级ID（精确查询） | 1 |
| gender | Integer | 否 | 性别（1-男，2-女） | 1 |

### 响应参数

**data 结构**:
```json
{
  "total": 150,
  "pages": 15,
  "current": 1,
  "size": 10,
  "records": []
}
```

**records 中每个学生的字段**:

| 字段名 | 类型 | 描述 | 示例值 |
|--------|------|------|--------|
| id | Long | 学生ID | 1001 |
| studentNo | String | 学号 | 202301001 |
| name | String | 姓名 | 张三 |
| gender | Integer | 性别（1-男，2-女） | 1 |
| idCard | String | 身份证号 | 110101200001011234 |
| phone | String | 手机号 | 13800138001 |
| email | String | 邮箱 | zhangsan@university.edu.cn |
| classId | Long | 班级ID | 1 |
| bedId | Long | 床位ID | 201 |
| createTime | String | 创建时间 | 2023-09-01T08:30:00 |

### 请求示例
```bash
GET /api/student/page?current=1&size=10&name=张&classId=1&gender=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 响应示例
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 45,
    "pages": 5,
    "current": 1,
    "size": 10,
    "records": [
      {
        "id": 1001,
        "studentNo": "202301001",
        "name": "张三",
        "gender": 1,
        "idCard": "110101200001011234",
        "phone": "13800138001",
        "email": "zhangsan@university.edu.cn",
        "classId": 1,
        "bedId": 201,
        "createTime": "2023-09-01T08:30:00"
      },
      {
        "id": 1002,
        "studentNo": "202301002",
        "name": "李四",
        "gender": 1,
        "idCard": "110101200001021234",
        "phone": "13800138002",
        "email": "lisi@university.edu.cn",
        "classId": 1,
        "bedId": 202,
        "createTime": "2023-09-01T08:35:00"
      }
    ]
  }
}
```

## 2. 新增学生信息

### 基本信息
- **请求方法**: POST
- **路径**: `/api/student`
- **权限要求**: `student:add`
- **功能描述**: 创建新的学生记录

### 请求参数（Body JSON）

| 字段名 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| studentNo | String | 是 | 学号（租户内唯一） | 202301003 |
| name | String | 是 | 学生姓名 | 王五 |
| gender | Integer | 是 | 性别（1-男，2-女） | 1 |
| idCard | String | 否 | 身份证号 | 110101200001031234 |
| phone | String | 否 | 手机号 | 13800138003 |
| email | String | 否 | 邮箱 | wangwu@university.edu.cn |
| classId | Long | 是 | 班级ID | 1 |

**注意**: `bedId` 和 `userId` 在新增时不传，后续通过专门接口分配。

### 响应参数

| 参数名 | 类型 | 描述 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 提示信息 |
| data | Object | 新增的学生ID |

### 请求示例
```json
{
  "studentNo": "202301003",
  "name": "王五",
  "gender": 1,
  "idCard": "110101200001031234",
  "phone": "13800138003",
  "email": "wangwu@university.edu.cn",
  "classId": 1
}
```

### 响应示例（成功）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1003
}
```

### 错误响应示例
```json
{
  "code": 500,
  "message": "学号已存在：202301003",
  "data": null
}
```

## 3. 修改学生基础信息

### 基本信息
- **请求方法**: PUT
- **路径**: `/api/student`
- **权限要求**: `student:edit`
- **功能描述**: 根据ID更新学生基础信息

### 请求参数（Body JSON）

| 字段名 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| id | Long | 是 | 学生ID | 1001 |
| studentNo | String | 是 | 学号（租户内唯一） | 202301001 |
| name | String | 是 | 学生姓名 | 张三丰 |
| gender | Integer | 是 | 性别（1-男，2-女） | 1 |
| idCard | String | 否 | 身份证号 | 110101200001011234 |
| phone | String | 否 | 手机号 | 13800138888 |
| email | String | 否 | 邮箱 | zhangsanfeng@university.edu.cn |
| classId | Long | 是 | 班级ID | 2 |

**注意**: `bedId` 不能通过此接口修改，需使用专门的分配床位接口。

### 响应参数

| 参数名 | 类型 | 描述 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 提示信息 |
| data | null | 无数据 |

### 请求示例
```json
{
  "id": 1001,
  "studentNo": "202301001",
  "name": "张三丰",
  "gender": 1,
  "phone": "13800138888",
  "email": "zhangsanfeng@university.edu.cn",
  "classId": 2
}
```

### 响应示例（成功）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 错误响应示例
```json
{
  "code": 500,
  "message": "学号已存在：202301001",
  "data": null
}
```

## 4. 分配/调换床位

### 基本信息
- **请求方法**: POST
- **路径**: `/api/student/assign-bed`
- **权限要求**: `student:assignBed`
- **功能描述**: 为学生分配或调换床位（核心业务接口）

### 请求参数（Body JSON）

| 字段名 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| studentId | Long | 是 | 学生ID | 1001 |
| targetBedId | Long | 是 | 目标床位ID | 205 |

**业务规则**:
1. 如果学生已有床位，则执行调换（先释放原床位）
2. 如果学生无床位，则执行分配
3. 目标床位必须为空闲状态（status=0）
4. 学生和目标床位必须在同一租户下
5. 目标床位所在房间必须未满员

### 响应参数

| 参数名 | 类型 | 描述 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 提示信息 |
| data | Object | 分配结果 |

**data 结构**:

| 字段名 | 类型 | 描述 | 示例值 |
|--------|------|------|--------|
| studentId | Long | 学生ID | 1001 |
| oldBedId | Long | 原床位ID（调换时有值） | 201 |
| newBedId | Long | 新床位ID | 205 |
| operation | String | 操作类型（assign/swap） | swap |

### 请求示例
```json
{
  "studentId": 1001,
  "targetBedId": 205
}
```

### 响应示例（分配成功）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "studentId": 1001,
    "oldBedId": null,
    "newBedId": 205,
    "operation": "assign"
  }
}
```

### 响应示例（调换成功）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "studentId": 1001,
    "oldBedId": 201,
    "newBedId": 205,
    "operation": "swap"
  }
}
```

### 错误响应示例
```json
{
  "code": 500,
  "message": "目标床位已被占用",
  "data": null
}
```

## 5. 批量逻辑删除学生

### 基本信息
- **请求方法**: DELETE
- **路径**: `/api/student`
- **权限要求**: `student:delete`
- **功能描述**: 批量逻辑删除学生记录

### 请求参数（Query Parameters）

| 参数名 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| ids | String | 是 | 学生ID列表，用逗号分隔 | 1001,1002,1003 |

**业务规则**:
1. 如果学生已分配床位，需要先释放床位
2. 如果学生有关联账号，需要解除关联
3. 执行逻辑删除（is_deleted=1），非物理删除

### 响应参数

| 参数名 | 类型 | 描述 |
|--------|------|------|
| code | Integer | 状态码 |
| message | String | 提示信息 |
| data | null | 无数据 |

### 请求示例
```bash
DELETE /api/student?ids=1001,1002,1003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 响应示例（成功）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 错误响应示例
```json
{
  "code": 500,
  "message": "学生不存在或已被删除",
  "data": null
}
```

## 注意事项

### 1. 数据一致性
由于数据库无外键约束，以下操作需要特别注意：
- **删除班级前**: 需要先检查是否有学生属于该班级
- **分配床位时**: 需要同时更新学生表和床位表
- **删除学生时**: 如果学生有床位，需要先释放床位

### 2. 事务处理
对于核心业务操作（如分配床位），后端使用事务保证数据一致性。前端需要：
- 显示加载状态，防止重复提交
- 提供操作结果反馈
- 支持操作失败时的重试

### 3. 性能优化
- 分页查询默认限制 size ≤ 100
- 频繁访问的数据（如班级选项）建议缓存

### 4. 安全考虑
- 所有接口都需要Token认证
- 权限控制到按钮级别
- 防止越权访问（用户只能访问自己租户的数据）

---

**文档版本**: v1.1  
**最后更新**: 2026-04-18  
**维护团队**: 宿舍管理系统开发团队
