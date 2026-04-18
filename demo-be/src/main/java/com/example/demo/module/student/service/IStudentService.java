package com.example.demo.module.student.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.module.student.dto.StudentQueryDTO;
import com.example.demo.module.student.dto.StudentSaveDTO;
import com.example.demo.module.student.entity.Student;

public interface IStudentService extends IService<Student> {

    /*分页查询学生列表*/
    IPage<Student> pageList(StudentQueryDTO queryDTO);

    /*新增学生*/
    void addStudent(StudentSaveDTO saveDTO);

    /*修改学生*/
    void updateStudent(StudentSaveDTO saveDTO);

    /*删除学生*/
    void deleteStudent(Long id);
}
