package com.example.demo.system.auth.dto;

import lombok.Data;

/**
 * 登录请求数据传输对象
 */
@Data
public class LoginDTO {
    
    /**
     * 账号
     */
    private String account;
    
    /**
     * 密码（预留字段，未来可能需要）
     */
    private String password;
}
