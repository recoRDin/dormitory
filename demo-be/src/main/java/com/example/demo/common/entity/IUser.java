package com.example.demo.common.entity;

/**
 * 通用用户接口
 * 
 * 设计目的：实现依赖倒置原则（Dependency Inversion Principle）
 * - framework 层依赖此接口，而非具体实现类
 * - system 层的实体类实现此接口
 * 
 * 优势：
 * 1. 解耦 framework 与 system 层的依赖关系
 * 2. framework 层可独立复用，无需依赖具体业务实体
 * 3. 符合 BladeX 架构的分层规范
 */
public interface IUser {
    
    /**
     * 获取用户ID
     */
    Long getId();
    
    /**
     * 设置用户ID
     */
    void setId(Long id);
    
    /**
     * 获取租户ID
     */
    String getTenantId();
    
    /**
     * 设置租户ID
     */
    void setTenantId(String tenantId);
    
    /**
     * 获取账号
     */
    String getAccount();
    
    /**
     * 设置账号
     */
    void setAccount(String account);
}
