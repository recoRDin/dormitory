package com.example.demo.framework.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.example.demo.common.entity.IUser;
import com.example.demo.framework.secure.UserContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Slf4j
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        log.debug("开始执行 MyBatis-Plus 自动插入填充...");
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "isDeleted", Integer.class, 0);

        // 从上下文获取当前用户
        IUser user = UserContext.getUser();
        if (user != null) {
            this.strictInsertFill(metaObject, "createUser", Long.class, user.getId());
            this.strictInsertFill(metaObject, "updateUser", Long.class, user.getId());
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        log.debug("开始执行 MyBatis-Plus 自动更新填充...");
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());

        IUser user = UserContext.getUser();
        if (user != null) {
            this.strictUpdateFill(metaObject, "updateUser", Long.class, user.getId());
        }
    }
}