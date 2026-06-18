package com.example.demo.biz.bed.controller;

import com.example.demo.biz.bed.service.BedSelectService;
import com.example.demo.biz.bed.service.IBedService;
import com.example.demo.common.api.Result;
import com.example.demo.framework.secure.RequireRole;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bed")
@RequiredArgsConstructor
public class BedController {

    private final IBedService bedService;
    private final BedSelectService bedSelectService;

    @GetMapping("/{id}/path")
    public Result<String> getBedPath(@PathVariable Long id) {

        return Result.success(bedService.getBedPath(id));
    }

    //初始化库存，管理员调用
    @RequireRole({"admin","manager"})
    @PostMapping("/init-stock")
    public Result<String> initStock() {
        bedSelectService.initStock();
        return Result.success("库存初始化完成");
    }

    //学生选床位
    @PostMapping("/select/{bedId}")
    public Result<String> select(@PathVariable Long bedId) {
        return Result.success(bedSelectService.selectBed(bedId));
    }
}

