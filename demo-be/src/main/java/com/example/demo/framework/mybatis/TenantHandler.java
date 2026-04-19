package com.example.demo.framework.mybatis;

import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.example.demo.framework.secure.UserContext;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.StringValue;
import org.springframework.stereotype.Component;

@Component
public class TenantHandler implements TenantLineHandler{

    //获取租户字段名
    @Override
    public Expression getTenantId() {
        String tenantId = UserContext.getTenantId();
        if (tenantId == null || tenantId.isEmpty()) {
            tenantId = "-1";
        }
        return  new StringValue(tenantId);
    }
    //获取租户字段名
    @Override
    public String getTenantIdColumn() {
        return "tenant_id";
    }

    // 没有登录用户时忽略租户过滤，避免开发阶段 tenant_id='-1' 导致查不到数据
    @Override
    public boolean ignoreTable(String tableName) {
        String tenantId = UserContext.getTenantId();
        return tenantId == null || tenantId.isEmpty();
    }


}
