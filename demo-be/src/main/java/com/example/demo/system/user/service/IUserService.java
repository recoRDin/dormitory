package com.example.demo.system.user.service;

import com.example.demo.system.user.dto.CreateUserDTO;
import com.example.demo.system.user.dto.UpdateUserDTO;
import com.example.demo.system.user.vo.UserRoleVO;
import java.util.List;

public interface IUserService {
    List<UserRoleVO> listAll();
    void updateRole(Long userId, Long roleId);
    void createUser(CreateUserDTO dto);
    void deleteUser(Long userId);
    void updateUser(Long userId, UpdateUserDTO dto);
}
