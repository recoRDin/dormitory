package com.example.demo.biz.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentSaveDTO {

    /** 主键ID（修改时必传，新增时不传） */
    private Long id;

    /** 学号 */
    @NotBlank(message = "学号不能为空")
    private String studentNo;

    /** 姓名 */
    @NotBlank(message = "姓名不能为空")
    private String name;

    /** 性别 1-男 2-女 */
    @NotNull(message = "性别不能为空")
    private Integer gender;

    /** 身份证号 */
    private String idCard;

    /** 联系电话 */
    private String phone;

    /** 邮箱 */
    private String email;

    /** 班级ID */
    @NotNull(message = "班级不能为空")
    private Long classId;
}
