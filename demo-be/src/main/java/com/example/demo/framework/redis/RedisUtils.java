package com.example.demo.framework.redis;

import com.example.demo.framework.secure.UserContext;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisUtils {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    private String wrapKey(String key) {
        String tenantId = UserContext.getTenantId();
        if (tenantId == null) {
            tenantId = "default";
        }
        return "Saas:" + tenantId + ":" + key;
    }

    public void set(String key, String value) {
        redisTemplate.opsForValue().set(wrapKey(key), value);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(wrapKey(key));
    }

    // 存整数 —— 用 StringRedisTemplate 确保存的是纯数字字符串，DECR/INCR 才能正常原子操作
    public void setInt(String key, int value) {
        stringRedisTemplate.opsForValue().set(wrapKey(key), String.valueOf(value));
    }

    // 原子减1，返回减后的值
    public Long decr(String key) {
        return stringRedisTemplate.opsForValue().decrement(wrapKey(key), 1);
    }

    // 原子加1，返回加后的值
    public Long incr(String key) {
        return stringRedisTemplate.opsForValue().increment(wrapKey(key), 1);
    }

    // 取整数值
    public Long getLong(String key) {
        String val = stringRedisTemplate.opsForValue().get(wrapKey(key));
        if (val == null) return null;
        return Long.valueOf(val);
    }
}
