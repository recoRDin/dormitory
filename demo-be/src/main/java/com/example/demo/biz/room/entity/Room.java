package com.example.demo.biz.room.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_room")
@EqualsAndHashCode(callSuper = true)
public class Room extends BaseEntity {

    @TableId
    private Long id;

    private Long buildingId;

    private Integer floor;

    private String roomNo;

    private String roomType;

    private Integer capacity;

    private Integer currentCount;

    private Long headStudentId;

    private String tenantId;
}
