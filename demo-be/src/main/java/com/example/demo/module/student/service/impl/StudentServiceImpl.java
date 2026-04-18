package com.example.demo.module.student.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.module.student.dto.StudentQueryDTO;
import com.example.demo.module.student.dto.StudentSaveDTO;
import com.example.demo.module.student.entity.Student;
import com.example.demo.module.student.service.IStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import com.example.demo.module.student.mapper.StudentMapper;


@Service
@RequiredArgsConstructor
public class StudentServiceImpl extends ServiceImpl<StudentMapper,Student> implements IStudentService {

    private final StudentMapper studentMapper;

    @Override
    public IPage<Student> pageList(StudentQueryDTO queryDTO){
        Page<Student> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        LambdaQueryWrapper<Student> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .like(queryDTO.getStudentNo() != null, Student::getStudentNo, queryDTO.getStudentNo())
                .like(queryDTO.getName() != null, Student::getName, queryDTO.getName())
                .eq(queryDTO.getGender() != null, Student::getGender, queryDTO.getGender())
                .eq(queryDTO.getClassId() != null, Student::getClassId, queryDTO.getClassId())
                .orderByDesc(Student::getCreateTime);
        return studentMapper.selectPage(page, wrapper);
    }

    @Override
    public void addStudent(StudentSaveDTO saveDTO) {
        //校验学号
        Long count = lambdaQuery()
                .eq(Student::getStudentNo,saveDTO.getStudentNo())
                .count();
        if(count>0){
            throw new RuntimeException("学号已存在" + saveDTO.getStudentNo());
        }
        Student student = new Student();
        BeanUtils.copyProperties(saveDTO,student);
        studentMapper.insert(student);
    }

    @Override
    public void updateStudent(StudentSaveDTO saveDTO) {
        //校验学号
        Long count = lambdaQuery()
                .eq(Student::getStudentNo,saveDTO.getStudentNo())
                .ne(Student::getId, saveDTO.getId())
                .count();
        if(count>0){
            throw new RuntimeException("学号已存在" + saveDTO.getStudentNo());
        }
        Student student = new Student();
        BeanUtils.copyProperties(saveDTO,student);
        studentMapper.updateById(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentMapper.deleteById(id);
    }
}
