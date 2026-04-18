package com.example.demo.common.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class BaseEntity implements Serializable {

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    // 插入时自动填充创建人 ID
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;

    // 插入和更新时都会自动填充
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    // 插入和更新时自动填充修改人 ID
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

    // 逻辑删除标记（0:未删除, 1:已删除）
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer isDeleted;
}
