package com.example.demo.biz.building.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.building.dto.BuildingQueryDTO;
import com.example.demo.biz.building.dto.BuildingSaveDTO;
import com.example.demo.biz.building.entity.Building;
import com.example.demo.biz.building.mapper.BuildingMapper;
import com.example.demo.biz.building.service.IBuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingServiceImpl extends ServiceImpl<BuildingMapper, Building> implements IBuildingService {

    private final BuildingMapper buildingMapper;

    @Override
    public IPage<Building> pageList(BuildingQueryDTO queryDTO) {
        Page<Building> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        page.setOptimizeCountSql(false);
        LambdaQueryWrapper<Building> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .like(queryDTO.getBuildingName() != null, Building::getBuildingName, queryDTO.getBuildingName())
                .orderByDesc(Building::getCreateTime);
        return buildingMapper.selectPage(page, wrapper);
    }

    @Override
    public Long addBuilding(BuildingSaveDTO saveDTO) {
        Building entity = new Building();
        BeanUtils.copyProperties(saveDTO, entity);
        buildingMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public void updateBuilding(BuildingSaveDTO saveDTO) {
        Building entity = new Building();
        BeanUtils.copyProperties(saveDTO, entity);
        buildingMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            buildingMapper.deleteById(id);
        }
    }

    @Override
    public List<Building> listAll() {
        return lambdaQuery()
                .orderByAsc(Building::getBuildingName)
                .list();
    }
}
