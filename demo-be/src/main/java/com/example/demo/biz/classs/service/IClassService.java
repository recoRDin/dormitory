package com.example.demo.biz.classs.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;

import java.util.List;

public interface IClassService extends IService<Class> {

    IPage<Class> pageList(ClassQueryDTO queryDTO);

    Long addClass(ClassSaveDTO saveDTO);

    void updateClass(ClassSaveDTO saveDTO);

    void batchDelete(List<Long> ids);

    List<Class> listAll();
}
