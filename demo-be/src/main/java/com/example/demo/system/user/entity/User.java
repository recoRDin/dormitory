package com.example.demo.system.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.IUser;
import lombok.Data;

/**
 * 用户身份模型（你的专属名牌）
 */
@Data
@TableName("sys_user")
public class User implements IUser {

    @TableId
    private Long id;
    @TableField("username")
    private String account;
    private String tenantId; // 核心：多租户ID
    private String name;
    private String password;
}
