package com.example.demo.biz.building.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_building")
@EqualsAndHashCode(callSuper = true)
public class Building extends BaseEntity {

    @TableId
    private Long id;

    private String buildingName;

    private Long managerUserId;

    private String tenantId;
}
