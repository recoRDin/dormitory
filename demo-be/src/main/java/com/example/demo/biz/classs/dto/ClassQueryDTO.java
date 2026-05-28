package com.example.demo.biz.classs.dto;

import lombok.Data;

@Data
public class ClassQueryDTO {

    private String major;

    private String grade;

    private String className;

    private Integer current = 1;

    private Integer size = 10;
}
