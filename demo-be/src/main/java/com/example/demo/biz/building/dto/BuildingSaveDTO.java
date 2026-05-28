package com.example.demo.biz.building.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BuildingSaveDTO {

    private Long id;

    @NotBlank(message = "楼宇名称不能为空")
    private String buildingName;

    @NotNull(message = "宿管不能为空")
    private Long managerUserId;
}
