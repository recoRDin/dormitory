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
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.bed.mapper.BedMapper;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.mapper.RoomMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements IStudentService {

    private final StudentMapper studentMapper;
    private final RoomMapper roomMapper;
    private final BedMapper bedMapper;

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

        //查询目标床位
        Bed targetBed = bedMapper.selectById(assignBedDTO.getTargetBedId());
        if (targetBed == null) {
            throw new BusinessException("目标床位不在");
        }
        if(targetBed.getStatus() == 1){
            throw new BusinessException("该床位已被占用");
        }
        if(targetBed.getStatus() == 2){
            throw new BusinessException("该床位不可分配");
        }

        //检查目标房间是否满员
        Room targetRoom = roomMapper.selectById(targetBed.getRoomId());
        if(targetRoom.getCurrentCount() >= targetRoom.getCapacity()){
            throw new BusinessException("该房间满员");
        }

        Long oldBedId = student.getBedId();
        String operation = (oldBedId == null)? "assign":"swap";

        //释放旧床位
        if(oldBedId != null){
            Bed oldBed = bedMapper.selectById(oldBedId);
            if(oldBed != null){
                oldBed.setStatus(0);
                bedMapper.updateById(oldBed);

                Room oldRoom = roomMapper.selectById(oldBed.getRoomId());
                oldRoom.setCurrentCount(oldRoom.getCurrentCount() - 1);
                roomMapper.updateById(oldRoom);
            }
        }

        //占用床位
        targetBed.setStatus(1);
        bedMapper.updateById(targetBed);

        targetRoom = roomMapper.selectById(targetBed.getRoomId());
        targetRoom.setCurrentCount(targetRoom.getCurrentCount() + 1);
        roomMapper.updateById(targetRoom);

        //更新床位
        student.setBedId(assignBedDTO.getTargetBedId());
        studentMapper.updateById(student);


        return buildResult(student,oldBedId,assignBedDTO.getTargetBedId(),operation);
    }
    private AssignBedResultVO buildResult(Student student, Long oldBedId, Long newBedId,String operation) {
        AssignBedResultVO result = new AssignBedResultVO();
        result.setStudentId(student.getId());
        result.setOldBedId(oldBedId);
        result.setNewBedId(newBedId);
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
            //释放床位
            if(student.getBedId() != null){
                Bed bed = bedMapper.selectById(student.getBedId());
                if (bed != null) {
                    bed.setStatus(0);
                    bedMapper.updateById(bed);

                    Room room = roomMapper.selectById(bed.getRoomId());
                    room.setCurrentCount(room.getCurrentCount() - 1);
                    roomMapper.updateById(room);
                }

            }

            // TODO: 解除账号关联（需 UserMapper，待完善后补充）
            // if (student.getUserId() != null) { ... 解除关联 ... }

            studentMapper.deleteById(id);
        }
    }
}
