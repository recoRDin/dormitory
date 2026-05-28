package com.example.demo.biz.classs.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_class")
@EqualsAndHashCode(callSuper = true)
public class Class extends BaseEntity {

    @TableId
    private Long id;

    private String major;

    private String grade;

    private String className;

    private Long counselorUserId;

    private String tenantId;
}
