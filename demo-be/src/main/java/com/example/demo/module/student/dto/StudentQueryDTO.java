package com.example.demo.module.student.dto;


import lombok.Data;

@Data
public class StudentQueryDTO {


    //查询筛选字段
    private String studentNo;

    private String name;

    private Integer gender;

    private Long classId;

    //分页参数
    private Integer current = 1;

    private Integer size = 10;
}
