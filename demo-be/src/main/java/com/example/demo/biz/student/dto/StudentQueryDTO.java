package com.example.demo.biz.student.dto;

import lombok.Data;

@Data
public class StudentQueryDTO {

    /** 学号（模糊查询） */
    private String studentNo;

    /** 姓名（模糊查询） */
    private String name;

    /** 性别 1-男 2-女 */
    private Integer gender;

    /** 班级ID */
    private Long classId;

    /** 当前页码，默认1 */
    private Integer current = 1;

    /** 每页条数，默认10 */
    private Integer size = 10;
}
