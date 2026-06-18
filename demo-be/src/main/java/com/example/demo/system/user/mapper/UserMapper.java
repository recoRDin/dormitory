package com.example.demo.system.user.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.system.user.entity.User;
import com.example.demo.system.user.vo.UserRoleVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface
UserMapper extends BaseMapper<User> {
    @InterceptorIgnore(tenantLine = "true")
    @Select("select *, username as account from sys_user where username = #{account} and is_deleted = 0")
    User selectUserForLogin(@Param("account") String account);

    @InterceptorIgnore(tenantLine = "true")
    @Select("select u.id, u.username as account, u.role_id as roleId, " +
            "u.tenant_id as tenantId, " +
            "r.role_code as roleCode, r.role_name as roleName " +
            "from sys_user u left join sys_role r on u.role_id = r.id " +
            "where u.is_deleted = 0")
    List<UserRoleVO> selectUserList();
}