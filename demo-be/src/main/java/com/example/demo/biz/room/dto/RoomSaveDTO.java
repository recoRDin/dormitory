package com.example.demo.biz.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomSaveDTO {

    private Long id;

    @NotNull(message = "楼宇不能为空")
    private Long buildingId;

    @NotNull(message = "楼层不能为空")
    private Integer floor;

    @NotBlank(message = "房间号不能为空")
    private String roomNo;

    private String roomType;

    @NotNull(message = "额定人数不能为空")
    private Integer capacity;

    private Long headStudentId;
}
