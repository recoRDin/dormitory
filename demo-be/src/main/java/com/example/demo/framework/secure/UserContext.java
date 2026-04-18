package com.example.demo.framework.secure;

import com.example.demo.common.entity.IUser;

public class UserContext {
    private static final ThreadLocal<IUser> USER_HOLDER = new ThreadLocal<>();
    private static final ThreadLocal<String> TENANT_HOLDER = new ThreadLocal<>();
    /**
     * 存入当前登录用户
     */
    public static void setUser(IUser user) {
        USER_HOLDER.set(user);
        if(user != null && user.getTenantId() != null) {
            setTenantID(user.getTenantId());
        }
    }

    /**
     * 获取当前登录用户
     */
    public static IUser getUser() {
        return USER_HOLDER.get();
    }

    /**
     * 必须清理！防止线程重用导致的"身份串号"
     */
    public static void clear() {
        USER_HOLDER.remove();
        TENANT_HOLDER.remove();
    }

    public static void setTenantID(String tenantId) {
        if(TENANT_HOLDER.get() != null) {
            TENANT_HOLDER.set((tenantId));
        }

    }

    public static String getTenantId() {

        return TENANT_HOLDER.get();
    }

}
