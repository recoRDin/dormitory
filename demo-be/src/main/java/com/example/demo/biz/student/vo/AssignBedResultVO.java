package com.example.demo.biz.student.vo;

import lombok.Data;

@Data
public class AssignBedResultVO {

    /** 学生ID */
    private Long studentId;

    /** 原床位ID（调换时有值） */
    private Long oldBedId;

    /** 新床位ID */
    private Long newBedId;

    /** 操作类型 assign-分配 swap-调换 */
    private String operation;
}
