package com.example.demo.biz.student.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.student.dto.AssignBedDTO;
import com.example.demo.biz.student.dto.StudentQueryDTO;
import com.example.demo.biz.student.dto.StudentSaveDTO;
import com.example.demo.biz.student.entity.Student;
import com.example.demo.biz.student.vo.AssignBedResultVO;

import java.util.List;

public interface IStudentService extends IService<Student> {

    /** 分页查询学生列表 */
    IPage<Student> pageList(StudentQueryDTO queryDTO);

    /** 新增学生，返回学生ID */
    Long addStudent(StudentSaveDTO saveDTO);

    /** 修改学生 */
    void updateStudent(StudentSaveDTO saveDTO);

    /** 分配/调换床位 */
    AssignBedResultVO assignBed(AssignBedDTO assignBedDTO);

    /** 批量逻辑删除学生 */
    void batchDelete(List<Long> ids);
}
