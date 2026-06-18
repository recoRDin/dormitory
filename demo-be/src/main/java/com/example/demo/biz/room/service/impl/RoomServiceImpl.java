package com.example.demo.biz.room.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.bed.mapper.BedMapper;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.mapper.RoomMapper;
import com.example.demo.biz.room.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl extends ServiceImpl<RoomMapper, Room> implements IRoomService {

    private final RoomMapper roomMapper;
    private final BedMapper bedMapper;

    @Override
    public IPage<Room> pageList(RoomQueryDTO queryDTO) {
        Page<Room> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        page.setOptimizeCountSql(false);
        LambdaQueryWrapper<Room> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .eq(queryDTO.getBuildingId() != null, Room::getBuildingId, queryDTO.getBuildingId())
                .eq(queryDTO.getFloor() != null, Room::getFloor, queryDTO.getFloor())
                .like(queryDTO.getRoomNo() != null, Room::getRoomNo, queryDTO.getRoomNo())
                .orderByAsc(Room::getBuildingId)
                .orderByAsc(Room::getFloor)
                .orderByAsc(Room::getRoomNo);
        return roomMapper.selectPage(page, wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addRoom(RoomSaveDTO saveDTO) {
        Room room = new Room();
        BeanUtils.copyProperties(saveDTO, room);
        room.setCurrentCount(0);
        roomMapper.insert(room);

        List<Bed> beds = new ArrayList<>();
        for (int i = 1; i <= saveDTO.getCapacity(); i++) {
            Bed bed = new Bed();
            bed.setRoomId(room.getId());
            bed.setBedNo(i);
            bed.setStatus(0);
            beds.add(bed);
        }
        for (Bed bed : beds) {
            bedMapper.insert(bed);
        }

        return room.getId();
    }

    @Override
    public void updateRoom(RoomSaveDTO saveDTO) {
        Room room = new Room();
        BeanUtils.copyProperties(saveDTO, room);
        roomMapper.updateById(room);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            LambdaQueryWrapper<Bed> bedWrapper = new LambdaQueryWrapper<>();
            bedWrapper.eq(Bed::getRoomId, id);
            bedMapper.delete(bedWrapper);

            roomMapper.deleteById(id);
        }
    }

    @Override
    public List<Bed> getBedsByRoomId(Long roomId) {
        LambdaQueryWrapper<Bed> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Bed::getRoomId, roomId)
                .orderByAsc(Bed::getBedNo);
        return bedMapper.selectList(wrapper);
    }
}
