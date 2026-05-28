package com.example.demo.biz.room.dto;

import lombok.Data;

@Data
public class RoomQueryDTO {

    private Long buildingId;

    private Integer floor;

    private String roomNo;

    private Integer current = 1;

    private Integer size = 10;
}
