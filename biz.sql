-- ==========================================================
-- 宿舍管理系统 (SaaS多租户版) - 最终版建库脚本
-- ==========================================================

-- ----------------------------
-- 1. 系统用户表 (sys_user)
-- ----------------------------
CREATE TABLE `sys_user` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                            `username` VARCHAR(50) NOT NULL COMMENT '登录账号',
                            `password` VARCHAR(100) NOT NULL COMMENT '登录密码(加密)',
                            `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
                            `role_id` BIGINT NOT NULL COMMENT '角色ID(关联sys_role)',
                            `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000' COMMENT '多租户ID(学校标识)',
                            `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                            `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除(0-正常, 1-删除)',
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_username_tenant` (`username`, `tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='系统用户表';

-- ----------------------------
-- 2. 系统角色表 (sys_role)
-- ----------------------------
CREATE TABLE `sys_role` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '角色编号(主键)',
                            `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
                            `role_code` VARCHAR(50) NOT NULL COMMENT '角色权限字符',
                            `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000' COMMENT '多租户ID',
                            `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                            `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除',
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='系统角色表';

-- ----------------------------
-- 3. 系统权限表 (sys_permission)
-- ----------------------------
CREATE TABLE `sys_permission` (
                                  `id` BIGINT NOT NULL AUTO_INCREMENT,
                                  `perm_code` VARCHAR(100) NOT NULL COMMENT '权限标识',
                                  `perm_name` VARCHAR(100) NOT NULL COMMENT '权限名称',
                                  `module` VARCHAR(50) NOT NULL COMMENT '归属模块',
                                  `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
                                  `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
                                  `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                                  `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                                  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  `is_deleted` TINYINT(1) DEFAULT 0,
                                  PRIMARY KEY (`id`),
                                  UNIQUE KEY `uk_perm_tenant` (`perm_code`, `tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='系统权限表';

-- ----------------------------
-- 4. 角色权限关联表 (sys_role_permission)
-- ----------------------------
CREATE TABLE `sys_role_permission` (
                                       `id` BIGINT NOT NULL AUTO_INCREMENT,
                                       `role_id` BIGINT NOT NULL,
                                       `permission_id` BIGINT NOT NULL,
                                       `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
                                       `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                                       `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                                       `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `uk_role_perm` (`role_id`, `permission_id`, `tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色权限关联表';

-- ----------------------------
-- 5. 业务班级表 (biz_class)
-- ----------------------------
CREATE TABLE `biz_class` (
                             `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                             `major` VARCHAR(100) NOT NULL COMMENT '专业名称',
                             `grade` VARCHAR(20) NOT NULL COMMENT '年级(如:2023级)',
                             `class_name` VARCHAR(50) NOT NULL COMMENT '班级名称',
                             `counselor_user_id` BIGINT NOT NULL COMMENT '辅导员ID(关联sys_user)',
                             `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000' COMMENT '多租户ID',
                             `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                             `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                             `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除',
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='班级信息表';

-- ----------------------------
-- 6. 业务宿舍楼表 (biz_building)
-- ----------------------------
CREATE TABLE `biz_building` (
                                `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                `building_name` VARCHAR(50) NOT NULL COMMENT '楼宇名称',
                                `manager_user_id` BIGINT NOT NULL COMMENT '宿管ID(关联sys_user)',
                                `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000' COMMENT '多租户ID',
                                `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                                `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                                `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除',
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='宿舍楼宇表';

-- ----------------------------
-- 7. 业务房间表 (biz_room)
-- ----------------------------
CREATE TABLE `biz_room` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                            `building_id` BIGINT NOT NULL COMMENT '楼宇ID',
                            `floor` INT NOT NULL COMMENT '楼层',
                            `room_no` VARCHAR(20) NOT NULL COMMENT '房间号',
                            `room_type` VARCHAR(20) DEFAULT NULL COMMENT '房间类型:4人间,6人间',
                            `capacity` INT DEFAULT NULL COMMENT '额定人数',
                            `current_count` INT DEFAULT 0 COMMENT '当前入住人数(Java层需用乐观锁或原子递增维护)',
                            `head_student_id` BIGINT DEFAULT NULL COMMENT '宿舍长ID',
                            `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
                            `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                            `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `is_deleted` TINYINT(1) DEFAULT 0,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_room_tenant` (`building_id`, `floor`, `room_no`, `tenant_id`),
                            INDEX `idx_building_id` (`building_id`),
                            INDEX `idx_head_student` (`head_student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='房间信息表';

-- ----------------------------
-- 8. 业务床位表 (biz_bed)
-- ----------------------------
CREATE TABLE `biz_bed` (
                           `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                           `room_id` BIGINT NOT NULL COMMENT '房间ID',
                           `bed_no` INT NOT NULL COMMENT '床位号',
                           `status` TINYINT(1) DEFAULT 0 COMMENT '0-空闲, 1-占用, 2-维修',
                           `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
                           `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                           `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                           `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
                           `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           `is_deleted` TINYINT(1) DEFAULT 0,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `uk_room_bed` (`room_id`, `bed_no`, `tenant_id`),
                           INDEX `idx_room_id` (`room_id`),
                           INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='床位信息表';

-- ----------------------------
-- 9. 业务学生表 (biz_student)
-- ----------------------------
CREATE TABLE `biz_student` (
                               `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                               `student_no` VARCHAR(20) NOT NULL COMMENT '学号',
                               `name` VARCHAR(50) NOT NULL,
                               `gender` TINYINT(1) NOT NULL COMMENT '1-男, 2-女',
                               `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
                               `phone` VARCHAR(20) DEFAULT NULL,
                               `email` VARCHAR(100) DEFAULT NULL,
                               `class_id` BIGINT NOT NULL COMMENT '班级ID',
                               `bed_id` BIGINT DEFAULT NULL COMMENT '当前床位ID(唯一绑定关系)',
                               `user_id` BIGINT DEFAULT NULL COMMENT '关联账号ID(可为空)',
                               `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000',
                               `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                               `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
                               `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               `is_deleted` TINYINT(1) DEFAULT 0,
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `uk_student_tenant` (`student_no`, `tenant_id`),
                               INDEX `idx_class_id` (`class_id`),
                               INDEX `idx_bed_id` (`bed_id`),
                               INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='学生信息表';

-- ----------------------------
-- 10. 业务卫生记录表 (biz_hygiene)
-- ----------------------------
CREATE TABLE `biz_hygiene` (
                               `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                               `room_id` BIGINT NOT NULL COMMENT '被检查房间ID(关联biz_room)',
                               `inspector_user_id` BIGINT NOT NULL COMMENT '检查人ID(关联sys_user)',
                               `score` DECIMAL(5,2) NOT NULL COMMENT '卫生得分',
                               `inspect_date` DATE NOT NULL COMMENT '检查日期',
                               `remark` VARCHAR(255) DEFAULT NULL COMMENT '检查备注/扣分原因',
                               `tenant_id` VARCHAR(32) NOT NULL DEFAULT '000000' COMMENT '多租户ID',
                               `create_user` BIGINT DEFAULT NULL COMMENT '创建人ID',
                               `update_user` BIGINT DEFAULT NULL COMMENT '更新人ID',
                               `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                               `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '逻辑删除',
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='卫生检查记录表';