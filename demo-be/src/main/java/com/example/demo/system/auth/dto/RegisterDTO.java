package com.example.demo.system.auth.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class RegisterDTO {

    //账号
    @NotBlank
    private String account;
    //密码
    @NotBlank
    private String password;
    //显示名称
    private String name;
    //角色ID
    private Long roleId;
    //租户ID
    private String tenantId;
}
