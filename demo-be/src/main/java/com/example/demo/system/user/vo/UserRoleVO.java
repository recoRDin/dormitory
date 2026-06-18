package com.example.demo.system.user.vo;

import lombok.Data;

@Data
public class UserRoleVO {
    private Long id;
    private String account;
    private Long roleId;
    private String roleCode;
    private String roleName;
    private String tenantId;
}
