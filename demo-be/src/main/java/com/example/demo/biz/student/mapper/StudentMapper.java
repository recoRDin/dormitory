package com.example.demo.biz.student.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.biz.student.entity.Student;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {

}
