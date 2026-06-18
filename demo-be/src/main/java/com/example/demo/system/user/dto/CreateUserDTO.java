package com.example.demo.system.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserDTO {
    @NotBlank
    private String account;
    @NotBlank
    private String password;
    private String name;
    @NotNull
    private Long roleId;
    private String tenantId;
}
