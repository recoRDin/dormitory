package com.example.demo.biz.building.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;
import com.example.demo.biz.building.service.IBuildingService;
import com.example.demo.common.api.Result;
import com.example.demo.framework.secure.RequireRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/building")
@RequiredArgsConstructor
public class BuildingController {

    private final IBuildingService buildingService;

    @GetMapping("/page")
    public Result<IPage<Building>> pageList(BuildingQueryDTO queryDTO) {
        return Result.success(buildingService.pageList(queryDTO));
    }

    @GetMapping("/list")
    public Result<List<Building>> listAll() {
        return Result.success(buildingService.listAll());
    }

    @RequireRole({"admin", "manager"})
    @PostMapping
    public Result<Long> add(@Valid @RequestBody BuildingSaveDTO saveDTO) {
        return Result.success(buildingService.addBuilding(saveDTO));
    }

    @RequireRole({"admin", "manager"})
    @PutMapping
    public Result<Void> update(@Valid @RequestBody BuildingSaveDTO saveDTO) {
        buildingService.updateBuilding(saveDTO);
        return Result.success();
    }

    @RequireRole({"admin", "manager"})
    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        buildingService.batchDelete(idList);
        return Result.success();
    }
}
