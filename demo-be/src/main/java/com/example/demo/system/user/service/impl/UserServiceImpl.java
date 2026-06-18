package com.example.demo.system.user.service.impl;

import com.example.demo.common.exception.BusinessException;
import com.example.demo.framework.secure.UserContext;
import com.example.demo.system.user.dto.CreateUserDTO;
import com.example.demo.system.user.dto.UpdateUserDTO;
import com.example.demo.system.user.entity.User;
import com.example.demo.system.user.mapper.UserMapper;
import com.example.demo.system.user.service.IUserService;
import com.example.demo.system.user.vo.UserRoleVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserMapper userMapper;

    @Override
    public List<UserRoleVO> listAll() {
        List<UserRoleVO> users = userMapper.selectUserList();
        String currentTenant = UserContext.getTenantId();
        if (currentTenant != null && !"000000".equals(currentTenant)) {
            users = users.stream()
                    .filter(u -> currentTenant.equals(u.getTenantId()))
                    .collect(Collectors.toList());
        }
        return users;
    }

    @Override
    public void updateRole(Long userId, Long roleId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setRoleId(roleId);
        userMapper.updateById(user);
    }

    @Override
    public void createUser(CreateUserDTO dto) {
        User exist = userMapper.selectUserForLogin(dto.getAccount());
        if (exist != null) {
            throw new BusinessException("该账号已存在");
        }
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        if (user.getTenantId() == null || user.getTenantId().isEmpty()) {
            String currentTenant = UserContext.getTenantId();
            user.setTenantId(currentTenant != null ? currentTenant : "default");
        }
        userMapper.insert(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        userMapper.deleteById(userId);
    }

    @Override
    public void updateUser(Long userId, UpdateUserDTO dto) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword());
        }
        if (dto.getRoleId() != null) {
            user.setRoleId(dto.getRoleId());
        }
        if (dto.getTenantId() != null && !dto.getTenantId().isEmpty()) {
            user.setTenantId(dto.getTenantId());
        }
        userMapper.updateById(user);
    }
}
