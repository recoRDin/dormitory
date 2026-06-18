package com.example.demo.biz.classs.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.demo.biz.classs.dto.ClassQueryDTO;
import com.example.demo.biz.classs.dto.ClassSaveDTO;
import com.example.demo.biz.classs.entity.Class;
import com.example.demo.biz.classs.mapper.ClassMapper;
import com.example.demo.biz.classs.service.IClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl extends ServiceImpl<ClassMapper, Class> implements IClassService {

    private final ClassMapper classMapper;

    @Override
    public IPage<Class> pageList(ClassQueryDTO queryDTO) {
        Page<Class> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
        page.setOptimizeCountSql(false);
        LambdaQueryWrapper<Class> wrapper = new LambdaQueryWrapper<>();
        wrapper
                .like(queryDTO.getMajor() != null, Class::getMajor, queryDTO.getMajor())
                .like(queryDTO.getGrade() != null, Class::getGrade, queryDTO.getGrade())
                .like(queryDTO.getClassName() != null, Class::getClassName, queryDTO.getClassName())
                .orderByDesc(Class::getCreateTime);
        return classMapper.selectPage(page, wrapper);
    }

    @Override
    public Long addClass(ClassSaveDTO saveDTO) {
        Class entity = new Class();
        BeanUtils.copyProperties(saveDTO, entity);
        classMapper.insert(entity);
        return entity.getId();
    }

    @Override
    public void updateClass(ClassSaveDTO saveDTO) {
        Class entity = new Class();
        BeanUtils.copyProperties(saveDTO, entity);
        classMapper.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDelete(List<Long> ids) {
        for (Long id : ids) {
            classMapper.deleteById(id);
        }
    }

    @Override
    public List<Class> listAll() {
        return lambdaQuery()
                .orderByAsc(Class::getGrade)
                .orderByAsc(Class::getClassName)
                .list();
    }
}
