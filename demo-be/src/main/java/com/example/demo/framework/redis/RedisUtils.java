package com.example.demo.framework.redis;

import com.example.demo.framework.secure.UserContext;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisUtils {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    private String wrapKey(String key) {
        String tenantId = UserContext.getTenantId();
        if (tenantId == null) {
            tenantId =  "default";
        }
        return "Saas:" + tenantId + ":" + key;
    }
    public void set(String key, String value) {
        redisTemplate.opsForValue().set(wrapKey(key), value);
    }
    public Object get(String key) {
        return redisTemplate.opsForValue().get(wrapKey(key));
    }
}
