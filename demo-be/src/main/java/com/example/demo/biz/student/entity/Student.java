package com.example.demo.biz.student.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@TableName("biz_student")
@EqualsAndHashCode(callSuper = true)
public class Student extends BaseEntity {

    @TableId
    private Long id;

    /** 学号 */
    private String studentNo;

    /** 姓名 */
    private String name;

    /** 性别 1-男 2-女 */
    private Integer gender;

    /** 身份证号 */
    private String idCard;

    /** 联系电话 */
    private String phone;

    /** 邮箱 */
    private String email;

    /** 班级ID */
    private Long classId;

    /** 当前床位ID */
    private Long bedId;

    /** 关联账号ID */
    private Long userId;

    /** 多租户ID */
    private String tenantId;
}
