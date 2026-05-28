package com.example.demo.biz.bed.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_bed")
@EqualsAndHashCode(callSuper = true)
public class Bed extends BaseEntity {

    @TableId
    private Long id;

    private Long roomId;

    private Integer bedNo;

    private Integer status;

    private String tenantId;
}
