package com.example.demo.biz.room.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.room.dto.RoomQueryDTO;
import com.example.demo.biz.room.dto.RoomSaveDTO;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.service.IRoomService;
import com.example.demo.common.api.Result;
import com.example.demo.framework.secure.RequireRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final IRoomService roomService;

    @GetMapping("/page")
    public Result<IPage<Room>> pageList(RoomQueryDTO queryDTO) {
        return Result.success(roomService.pageList(queryDTO));
    }

    @RequireRole({"admin", "manager"})
    @PostMapping
    public Result<Long> add(@Valid @RequestBody RoomSaveDTO saveDTO) {
        return Result.success(roomService.addRoom(saveDTO));
    }

    @RequireRole({"admin", "manager"})
    @PutMapping
    public Result<Void> update(@Valid @RequestBody RoomSaveDTO saveDTO) {
        roomService.updateRoom(saveDTO);
        return Result.success();
    }

    @RequireRole({"admin", "manager"})
    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        roomService.batchDelete(idList);
        return Result.success();
    }

    @GetMapping("/{id}/beds")
    public Result<List<Bed>> getBeds(@PathVariable Long id) {
        return Result.success(roomService.getBedsByRoomId(id));
    }
}
