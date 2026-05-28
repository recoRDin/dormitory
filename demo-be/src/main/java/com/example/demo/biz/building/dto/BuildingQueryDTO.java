package com.example.demo.biz.building.dto;

import lombok.Data;

@Data
public class BuildingQueryDTO {

    private String buildingName;

    private Integer current = 1;

    private Integer size = 10;
}
