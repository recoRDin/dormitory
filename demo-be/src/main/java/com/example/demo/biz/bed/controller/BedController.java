package com.example.demo.biz.bed.controller;

import com.example.demo.biz.bed.service.IBedService;
import com.example.demo.common.api.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bed")
@RequiredArgsConstructor
public class BedController {

    private final IBedService bedService;

    @GetMapping("/{id}/path")
    public Result<String> getBedPath(@PathVariable Long id) {
        return Result.success(bedService.getBedPath(id));
    }
}

