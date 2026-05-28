package com.example.demo.biz.room.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;

import java.util.List;

public interface IRoomService extends IService<Room> {

    IPage<Room> pageList(RoomQueryDTO queryDTO);

    Long addRoom(RoomSaveDTO saveDTO);

    void updateRoom(RoomSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Bed> getBedsByRoomId(Long roomId);
}
