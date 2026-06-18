package com.example.demo.system.user.dto;

import lombok.Data;

@Data
public class UpdateUserDTO {
    private String password;
    private Long roleId;
    private String tenantId;
}
