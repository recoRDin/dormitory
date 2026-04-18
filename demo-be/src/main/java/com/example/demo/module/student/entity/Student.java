package com.example.demo.module.student.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("module_student")
@EqualsAndHashCode(callSuper = true)
public class Student extends BaseEntity{

    @TableId
    private Long id;

    private String studentNo;

    private String name;

    private Integer gender;

    private String idCard;

    private String phone;

    private String email;

    private Long classId;

    private Long bedId;

    private Long userId;

    private String tenant_id;
}