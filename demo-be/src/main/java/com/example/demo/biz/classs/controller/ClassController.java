package com.example.demo.biz.classs.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;
import com.example.demo.biz.classs.service.IClassService;
import com.example.demo.common.api.Result;
import com.example.demo.framework.secure.RequireRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/class")
@RequiredArgsConstructor
public class ClassController {

    private final IClassService classService;

    @GetMapping("/page")
    public Result<IPage<Class>> pageList(ClassQueryDTO queryDTO) {
        return Result.success(classService.pageList(queryDTO));
    }

    @GetMapping("/list")
    public Result<List<Class>> listAll() {
        return Result.success(classService.listAll());
    }

    @RequireRole({"admin", "manager"})
    @PostMapping
    public Result<Long> add(@Valid @RequestBody ClassSaveDTO saveDTO) {
        return Result.success(classService.addClass(saveDTO));
    }

    @RequireRole({"admin", "manager"})
    @PutMapping
    public Result<Void> update(@Valid @RequestBody ClassSaveDTO saveDTO) {
        classService.updateClass(saveDTO);
        return Result.success();
    }

    @RequireRole({"admin", "manager"})
    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        classService.batchDelete(idList);
        return Result.success();
    }
}
