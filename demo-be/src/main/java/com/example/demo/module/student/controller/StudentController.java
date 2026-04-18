package com.example.demo.module.student.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.demo.common.api.Result;
import com.example.demo.module.student.dto.StudentQueryDTO;
import com.example.demo.module.student.dto.StudentSaveDTO;
import com.example.demo.module.student.entity.Student;
import com.example.demo.module.student.service.IStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final IStudentService studentService;

    /*分页查询学生列表*/
    @GetMapping("/page")
    public Result<IPage<Student>> pageList(StudentQueryDTO queryDTO) {
        return Result.success(studentService.pageList(queryDTO));
    }

    /*根据id查询学生*/
    @GetMapping("/{id}")
    public Result<Student> detail(@PathVariable Long id) {
        return Result.success(studentService.getById(id));
    }


    /*新增学生*/
    @PostMapping
    public Result<Student> add( @RequestBody StudentSaveDTO saveDTO) {
        studentService.addStudent(saveDTO);
        return Result.success();
    }


    /*修改学生*/
    @PutMapping
    public Result<Student> update( @RequestBody StudentSaveDTO saveDTO) {
        studentService.updateStudent(saveDTO);
        return Result.success();
    }


    /*删除学生*/
    @DeleteMapping("/{id}")
    public Result<Student> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return Result.success();
    }
}
