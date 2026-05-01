package com.example.demo.system.user.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.system.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.repository.query.Param;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @InterceptorIgnore(tenantLine = "true")
    @Select("select * from sys_user where username = #{account} and is_deleted = 0")
    User selectUserForLogin(@Param("account") String account);
}