package com.example.demo.module.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentSaveDTO {
    //主键id
    private Long id;

    @NotBlank(message = "不能为空")
    private String studentNo;

    @NotBlank(message = "不能为空")
    private String name;

    @NotNull(message = "不能为空")
    private Integer gender;

    @NotNull(message = "不能为空")
    private Long classId;

    private String idCard;

    private String phone;

    private String email;

    private Long bedId;

    private Long userId;

    private String tenant_id;

}
