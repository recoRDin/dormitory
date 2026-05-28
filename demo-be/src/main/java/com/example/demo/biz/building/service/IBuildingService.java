package com.example.demo.biz.building.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;

import java.util.List;

public interface IBuildingService extends IService<Building> {

    IPage<Building> pageList(BuildingQueryDTO queryDTO);

    Long addBuilding(BuildingSaveDTO saveDTO);

    void updateBuilding(BuildingSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Building> listAll();
}
