package com.example.demo.biz.student.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.biz.student.dto.AssignBedDTO;
import com.example.demo.biz.student.dto.StudentQueryDTO;
import com.example.demo.biz.student.dto.StudentSaveDTO;
import com.example.demo.biz.student.entity.Student;
import com.example.demo.biz.student.service.IStudentService;
import com.example.demo.biz.student.vo.AssignBedResultVO;
import com.example.demo.common.api.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final IStudentService studentService;

    /** 1. 分页查询学生列表 */
    @GetMapping("/page")
    public Result<IPage<Student>> pageList(StudentQueryDTO queryDTO) {
        return Result.success(studentService.pageList(queryDTO));
    }

    /** 2. 新增学生信息 */
    @PostMapping
    public Result<Long> add(@Valid @RequestBody StudentSaveDTO saveDTO) {
        Long id = studentService.addStudent(saveDTO);
        return Result.success(id);
    }

    /** 3. 修改学生基础信息 */
    @PutMapping
    public Result<Void> update(@Valid @RequestBody StudentSaveDTO saveDTO) {
        studentService.updateStudent(saveDTO);
        return Result.success();
    }

    /** 4. 分配/调换床位 */
    @PostMapping("/assign-bed")
    public Result<AssignBedResultVO> assignBed(@Valid @RequestBody AssignBedDTO assignBedDTO) {
        return Result.success(studentService.assignBed(assignBedDTO));
    }

    /** 5. 批量逻辑删除学生 */
    @DeleteMapping
    public Result<Void> batchDelete(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        studentService.batchDelete(idList);
        return Result.success();
    }
}
