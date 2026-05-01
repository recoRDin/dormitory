package com.example.demo.system.auth.controller;

import com.example.demo.common.utils.JwtUtil;
import com.example.demo.common.api.Result;
import com.example.demo.system.auth.dto.LoginDTO;
import com.example.demo.system.user.entity.User;
import com.example.demo.system.user.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Resource
    private UserMapper userMapper;
    
    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginDTO loginDTO) {
        String account = loginDTO.getAccount();
        
        User user = userMapper.selectUserForLogin(account);
        if (user == null) {
            return Result.error("账号不存在");
        }

        if(!loginDTO.getPassword().equals(user.getPassword())){
            return Result.error("密码错误");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", user.getId());
        claims.put("tenant_id", user.getTenantId());

        String token = JwtUtil.createToken(claims, user.getAccount());
        return Result.success("登录成功", token);
    }
}
