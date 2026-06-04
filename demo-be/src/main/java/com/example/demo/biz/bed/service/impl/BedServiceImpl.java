package com.example.demo.biz.bed.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.bed.mapper.BedMapper;
import com.example.demo.biz.bed.service.IBedService;
import com.example.demo.biz.building.entity.Building;
import com.example.demo.biz.building.mapper.BuildingMapper;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.mapper.RoomMapper;
import com.example.demo.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class BedServiceImpl extends ServiceImpl<BedMapper,Bed> implements IBedService {

    private final BedMapper bedMapper;
    private final RoomMapper roomMapper;
    private final BuildingMapper buildingMapper;


    @Override
    public String getBedPath(Long bedId) {
        Bed bed = bedMapper.selectById(bedId);
        if (bed == null) {
            throw new BusinessException("床位不存在");
        }
        Room room = roomMapper.selectById(bed.getRoomId());
        if (room == null) {
            throw new BusinessException("房间不存在");
        }
        Building building = buildingMapper.selectById(room.getBuildingId());
        if (building == null) {
            throw new BusinessException("楼宇不存在");
        }
        return building.getBuildingName() + " " + room.getRoomNo() + "房间 " + bed.getBedNo()
                + "号床";
    }

}
