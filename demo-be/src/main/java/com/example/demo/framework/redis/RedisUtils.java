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
    //存整数
    public void setInt(String key, int value) {
        redisTemplate.opsForValue().set(wrapKey(key), value);
    }

    //原子减1，返回减后的值
    public Long decr(String key) {
        return redisTemplate.opsForValue().decrement(wrapKey(key),1);
    }

    //原子加1，返回加后的值
    public Long incr(String key) {
        return redisTemplate.opsForValue().increment(wrapKey(key),1);
    }

    //取整数值
    public Long getLong(String key) {
       Object val =redisTemplate.opsForValue().get(wrapKey(key));
       if(val == null) return null;
       return Long.valueOf(val.toString());
    }
}
