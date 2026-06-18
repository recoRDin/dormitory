package com.example.demo.system.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.IUser;
import lombok.Data;

@Data
@TableName("sys_user")
public class User implements IUser {

    @TableId
    private Long id;
    @TableField("username")
    private String account;
    private String tenantId;
    private String password;
    private Long roleId;

    @TableField(exist = false)
    private String roleCode;
}
