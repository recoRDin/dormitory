package com.example.demo.biz.student.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignBedDTO {

    /** 学生ID */
    @NotNull(message = "学生ID不能为空")
    private Long studentId;

    /** 目标床位ID */
    @NotNull(message = "目标床位ID不能为空")
    private Long targetBedId;
}
