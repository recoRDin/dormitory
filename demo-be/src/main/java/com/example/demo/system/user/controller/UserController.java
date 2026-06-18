package com.example.demo.system.user.controller;

import com.example.demo.common.api.Result;
import com.example.demo.framework.secure.RequireRole;
import com.example.demo.system.user.dto.CreateUserDTO;
import com.example.demo.system.user.dto.RoleUpdateDTO;
import com.example.demo.system.user.dto.UpdateUserDTO;
import com.example.demo.system.user.service.IUserService;
import com.example.demo.system.user.vo.UserRoleVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @RequireRole("admin")
    @GetMapping("/list")
    public Result<List<UserRoleVO>> listAll() {
        return Result.success(userService.listAll());
    }

    @RequireRole("admin")
    @PutMapping("/role")
    public Result<Void> updateRole(@RequestBody RoleUpdateDTO dto) {
        userService.updateRole(dto.getUserId(), dto.getRoleId());
        return Result.success();
    }

    @RequireRole("admin")
    @PostMapping("/create")
    public Result<Void> create(@Valid @RequestBody CreateUserDTO dto) {
        userService.createUser(dto);
        return Result.success();
    }

    @RequireRole("admin")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    @RequireRole("admin")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody UpdateUserDTO dto) {
        userService.updateUser(id, dto);
        return Result.success();
    }
}
