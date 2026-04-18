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

    //需要忽略的表
    @Override
    public boolean ignoreTable(String tableName) {
        return false;
    }


}
