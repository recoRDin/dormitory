-- ============================================================
-- 宿舍管理系统 - 数据库初始化脚本
-- 日期: 2026-06-19
-- ============================================================

-- 1. 系统角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `id` bigint NOT NULL,
    `role_name` varchar(50) NOT NULL COMMENT '角色名称',
    `role_code` varchar(50) NOT NULL COMMENT '角色编码（admin/manager/student）',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

-- 2. 系统用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id` bigint NOT NULL,
    `username` varchar(50) NOT NULL COMMENT '登录账号',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `role_id` bigint NOT NULL COMMENT '角色ID',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 3. 楼宇表
DROP TABLE IF EXISTS `biz_building`;
CREATE TABLE `biz_building` (
    `id` bigint NOT NULL,
    `building_name` varchar(50) NOT NULL COMMENT '楼宇名称',
    `manager_user_id` bigint NOT NULL DEFAULT '0' COMMENT '宿管用户ID',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='楼宇表';

-- 4. 房间表
DROP TABLE IF EXISTS `biz_room`;
CREATE TABLE `biz_room` (
    `id` bigint NOT NULL,
    `building_id` bigint NOT NULL COMMENT '所属楼宇ID',
    `floor` int NOT NULL COMMENT '楼层',
    `room_no` varchar(20) NOT NULL COMMENT '房间号',
    `room_type` varchar(20) DEFAULT NULL COMMENT '房间类型',
    `capacity` int DEFAULT NULL COMMENT '可容纳人数',
    `current_count` int DEFAULT '0' COMMENT '当前人数',
    `head_student_id` bigint DEFAULT NULL COMMENT '舍长学生ID',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_building_id` (`building_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房间表';

-- 5. 床位表
DROP TABLE IF EXISTS `biz_bed`;
CREATE TABLE `biz_bed` (
    `id` bigint NOT NULL,
    `room_id` bigint NOT NULL COMMENT '所属房间ID',
    `bed_no` int NOT NULL COMMENT '床位编号',
    `status` tinyint(1) DEFAULT '0' COMMENT '状态(0-空闲/1-已占用)',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    `version` int NOT NULL DEFAULT '0' COMMENT '乐观锁版本号',
    PRIMARY KEY (`id`),
    KEY `idx_room_id` (`room_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='床位表';

-- 6. 学生表
DROP TABLE IF EXISTS `biz_student`;
CREATE TABLE `biz_student` (
    `id` bigint NOT NULL,
    `student_no` varchar(20) NOT NULL COMMENT '学号',
    `name` varchar(50) NOT NULL COMMENT '姓名',
    `gender` tinyint(1) NOT NULL COMMENT '性别(1-男/2-女)',
    `id_card` varchar(20) DEFAULT NULL COMMENT '身份证号',
    `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `class_id` bigint NOT NULL COMMENT '班级ID',
    `bed_id` bigint DEFAULT NULL COMMENT '床位ID',
    `user_id` bigint DEFAULT NULL COMMENT '关联账号ID',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_student_no` (`student_no`),
    KEY `idx_class_id` (`class_id`),
    KEY `idx_bed_id` (`bed_id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';

-- 7. 班级表
DROP TABLE IF EXISTS `biz_class`;
CREATE TABLE `biz_class` (
    `id` bigint NOT NULL,
    `major` varchar(100) NOT NULL COMMENT '专业',
    `grade` varchar(20) NOT NULL COMMENT '年级',
    `class_name` varchar(50) NOT NULL COMMENT '班级名称',
    `counselor_user_id` bigint NOT NULL DEFAULT '0' COMMENT '辅导员用户ID',
    `tenant_id` varchar(32) NOT NULL DEFAULT '000000' COMMENT '租户ID',
    `create_user` bigint DEFAULT NULL COMMENT '创建人',
    `update_user` bigint DEFAULT NULL COMMENT '修改人',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='班级表';

-- ============================================================
-- 初始数据
-- ============================================================

-- 角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `tenant_id`) VALUES
(1, '超级管理员', 'admin',   '000000'),
(2, '宿管',       'manager', '000000'),
(3, '学生',       'student', '000000');

-- 超级管理员账号（密码: superadmin，明文存储，后续应改为 BCrypt）
INSERT INTO `sys_user` (`id`, `username`, `password`, `role_id`, `tenant_id`) VALUES
(1, 'superadmin', 'superadmin', 1, '000000');
