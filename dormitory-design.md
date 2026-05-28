# 宿舍管理系统 - 设计方案

> 毕设项目 | 2-4 周 | 方案 B：完整演示路径

---

## 一、项目现状

### 已完成
- 认证登录（JWT，暂未开启拦截器）
- 学生管理模块（完整 CRUD + 分页 + 床位分配前端）
- 前端路由保护（Next.js 中间件）
- RBAC 表结构（sys_user / sys_role / sys_permission / sys_role_permission）
- 多租户基础设施（MyBatis 拦截器 + Redis key 前缀 + ThreadLocal 上下文）
- 前端框架搭建（Ant Design 6 + Zustand + Axios 拦截器）

### 待修复
- 床位分配事务不完整：`StudentServiceImpl.assignBed()` 中引用 `BedMapper` 的代码是 TODO
- 遗留代码：`StudentTestController`、`MockDataUtil` 引用不存在的包
- 仪表盘数据硬编码为 0

### 未开发
- 卫生检查模块（DDL 已定义 `biz_hygiene`）
- 班级/楼宇/房间管理（DDL 已定义）
- RBAC 权限落地
- 仪表盘真实统计

---

## 二、依赖关系

```
班级 ─────────────────────────────────────────┐
                                              │
楼宇 ──→ 房间 ──→ 床位 ──→ 学生（分配床位）   │
                              │               │
                              ▼               │
                          卫生检查 ◄── 房间 ───┘
```

**关键约束**：班级、楼宇、房间是床位分配和卫生检查的前置条件，必须先完成。

---

## 三、实施路线

### 第 1 周：基础数据管理 + 修复

**目标**：建立完整的数据链条（班级 → 楼宇 → 房间 → 床位），后续所有模块依赖真实数据。

#### 1.1 清理遗留代码

删除编译报错的测试文件：`StudentTestController.java`、`MockDataUtil.java`

#### 1.2 班级管理

后端 `biz/class/`：`entity → mapper → dto(Save+Query) → service → controller`
前端：`/class` 页面，表格 + 新增/编辑弹窗

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/class/page` | 分页查询 |
| POST | `/class` | 新增班级 |
| PUT | `/class` | 修改班级 |
| DELETE | `/class` | 删除班级 |
| GET | `/class/list` | 全部列表（供其他模块下拉选择） |

#### 1.3 楼宇管理

后端 `biz/building/`：同上分层
前端：`/building` 页面

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/building/page` | 分页查询 |
| POST | `/building` | 新增楼宇 |
| PUT | `/building` | 修改楼宇 |
| DELETE | `/building` | 删除楼宇 |
| GET | `/building/list` | 全部列表（供下拉选择） |

#### 1.4 房间管理

后端 `biz/room/`：同上分层，关联 building 和 bed
前端：`/room` 页面，表格展示楼宇名+楼层+房间号+容量+入住人数

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/room/page` | 分页查询（可按楼宇筛选） |
| POST | `/room` | 新增房间（同时批量创建床位记录到 biz_bed） |
| PUT | `/room` | 修改房间 |
| DELETE | `/room` | 删除房间（级联删除该房间所有床位） |
| GET | `/room/{id}/beds` | 查看房间内床位列表 |

**设计要点**：新增房间时，根据房间容量自动批量创建床位（`biz_bed` 表），状态默认空闲。删除房间时级联删除所有床位。

### 第 2 周：床位分配 + 卫生检查

**目标**：基于第 1 周的真实数据，补全床位分配事务，开发卫生检查模块。

#### 2.1 补全床位分配事务

新建 `BedMapper`，修改 `StudentServiceImpl.assignBed()`：

```
@Transactional
assignBed(studentId, targetBedId):
  1. 查当前学生已有床位 → 如有，释放旧床位（status=空闲）
  2. 占用新床位（status=占用）
  3. 更新学生表的 bed_id
```

如果目标床位状态为"维修"则抛 BusinessException。

#### 2.2 卫生检查模块

后端 `biz/hygiene/`：标准分层
前端：`/hygiene` 页面

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/hygiene/page` | 分页查询（按楼宇/房间/日期筛选） |
| POST | `/hygiene` | 新增检查记录 |
| PUT | `/hygiene` | 修改检查记录 |
| DELETE | `/hygiene` | 删除检查记录 |

### 第 3 周：仪表盘 + 收尾

- **仪表盘** — 后端 `GET /dashboard/stats` 返回 `{ studentCount, buildingCount, classCount, freeBedCount }`，前端替换硬编码
- 导航侧边栏补充新增的菜单项（班级、楼宇、房间、卫生检查、仪表盘）
- 学生管理页面的班级下拉和床位下拉接入真实数据

### 第 4 周：联调 + 交付

- 端到端流程：班级→楼宇→房间→床位→学生→分配床位→卫生检查→仪表盘
- 开启认证拦截器
- Bug 修复
- 答辩准备

---

## 三、架构约定

- 统一响应：`Result<T>` 包装，`GlobalExceptionHandler` 处理异常
- DTO 校验：`jakarta.validation` 注解，400 自动返回
- 多租户：所有业务表查询自动追加 `WHERE tenant_id = ?`
- 前端请求：统一走 `utils/request.ts` Axios 实例
- 删除操作：统一逻辑删除（MyBatis-Plus `is_deleted` 字段）
- 不添加注释，除非有非显而易见的逻辑
- 不做过度抽象，三个相似行不提取公用组件

---

## 四、不在此次范围内的内容

- 动态菜单权限（AuthButton 保留，等后端权限落地后再接）
- 测试代码编写
- CI/CD 配置
- 生产环境部署配置
- 数据导入/导出
