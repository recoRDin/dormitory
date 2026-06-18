package com.example.demo.framework.mybatis;

import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.example.demo.framework.secure.UserContext;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.StringValue;
import org.springframework.stereotype.Component;

@Component
public class TenantHandler implements TenantLineHandler{

    @Override
    public Expression getTenantId() {
        String tenantId = UserContext.getTenantId();
        if (tenantId == null || tenantId.isEmpty()) {
            return new StringValue("-1");
        }
        return new StringValue(tenantId);
    }

    @Override
    public String getTenantIdColumn() {
        return "tenant_id";
    }

    @Override
    public boolean ignoreTable(String tableName) {
        String tenantId = UserContext.getTenantId();
        if (tenantId == null || tenantId.isEmpty()) {
            return true;
        }
        if ("000000".equals(tenantId)) {
            return true;
        }
        return false;
    }


}
