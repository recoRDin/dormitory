package com.example.demo.biz.student.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.student.dto.AssignBedDTO;
import com.example.demo.biz.student.dto.StudentQueryDTO;
import com.example.demo.biz.student.dto.StudentSaveDTO;
import com.example.demo.biz.student.entity.Student;
import com.example.demo.biz.student.mapper.StudentMapper;
import com.example.demo.biz.student.service.IStudentService;
import com.example.demo.biz.student.vo.AssignBedResultVO;
import com.example.demo.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements IStudentService {

    private final StudentMapper studentMapper;

    @Override
    public IPage<Student> pageList(StudentQueryDTO queryDTO) {
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
    public Long addStudent(StudentSaveDTO saveDTO) {
        // 校验学号唯一性
        Long count = lambdaQuery()
                .eq(Student::getStudentNo, saveDTO.getStudentNo())
                .count();
        if (count > 0) {
            throw new BusinessException("学号已存在：" + saveDTO.getStudentNo());
        }
        Student student = new Student();
        BeanUtils.copyProperties(saveDTO, student);
        studentMapper.insert(student);
        return student.getId();
    }

    @Override
    public void updateStudent(StudentSaveDTO saveDTO) {
        // 校验学号唯一性（排除自身）
        Long count = lambdaQuery()
                .eq(Student::getStudentNo, saveDTO.getStudentNo())
                .ne(Student::getId, saveDTO.getId())
                .count();
        if (count > 0) {
            throw new BusinessException("学号已存在：" + saveDTO.getStudentNo());
        }
        Student student = new Student();
        BeanUtils.copyProperties(saveDTO, student);
        studentMapper.updateById(student);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AssignBedResultVO assignBed(AssignBedDTO assignBedDTO) {
        Student student = studentMapper.selectById(assignBedDTO.getStudentId());
        if (student == null) {
            throw new BusinessException("学生不存在");
        }

        Long oldBedId = student.getBedId();
        String operation = (oldBedId == null) ? "assign" : "swap";

        // TODO: 校验目标床位是否空闲（需 BedMapper，待床位模块开发后补充）
        // TODO: 校验目标床位所在房间是否未满员

        // 更新学生床位
        student.setBedId(assignBedDTO.getTargetBedId());
        studentMapper.updateById(student);

        // TODO: 释放原床位状态（需 BedMapper）
        // TODO: 占用目标床位状态（需 BedMapper）

        AssignBedResultVO result = new AssignBedResultVO();
        result.setStudentId(student.getId());
        result.setOldBedId(oldBedId);
        result.setNewBedId(assignBedDTO.getTargetBedId());
        result.setOperation(operation);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            Student student = studentMapper.selectById(id);
            if (student == null) {
                continue;
            }
            // TODO: 释放床位（需 BedMapper，待床位模块开发后补充）
            // if (student.getBedId() != null) { ... 释放床位 ... }

            // TODO: 解除账号关联（需 UserMapper，待完善后补充）
            // if (student.getUserId() != null) { ... 解除关联 ... }

            studentMapper.deleteById(id);
        }
    }
}
