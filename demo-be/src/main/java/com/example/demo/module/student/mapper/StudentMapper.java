package com.example.demo.module.student.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.module.student.entity.Student;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {

}