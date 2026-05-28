package com.example.demo.biz.classs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassSaveDTO {

    private Long id;

    @NotBlank(message = "专业不能为空")
    private String major;

    @NotBlank(message = "年级不能为空")
    private String grade;

    @NotBlank(message = "班级名称不能为空")
    private String className;

    @NotNull(message = "辅导员不能为空")
    private Long counselorUserId;
}
