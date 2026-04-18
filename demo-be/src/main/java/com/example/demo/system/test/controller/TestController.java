package com.example.demo.system.test.controller;

import com.example.demo.common.entity.IUser;
import com.example.demo.framework.secure.UserContext;
import com.example.demo.system.user.entity.User;
import com.example.demo.system.user.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {
    @Resource
    private UserMapper userMapper;
    @Resource
    private RedisTemplate<String,Object> redisTemplate;

    @GetMapping("/test/user/info")
    public User getInfo() {
        // 直接从咱们的 ThreadLocal "口袋"里掏数据
        IUser iUser = UserContext.getUser();
        // 类型转换（因为实际存储的是 User 实例）
        return (User) iUser;
    }

    @GetMapping("/test/user/list")
    public List<User> getUsers() {
        System.out.println("🚀 成功触发了接口！正在执行数据库查询...");
        return userMapper.selectList(null);
    }

    @GetMapping("/redis-test")
    public String test() {
        User user = new User();
        user.setAccount("bin666");
        user.setName("admin");

        redisTemplate.opsForValue().set("user",user);
        return "success";
    }
}
