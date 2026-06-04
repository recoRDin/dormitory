package com.example.demo.biz.bed.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.demo.biz.bed.entity.Bed;

public interface IBedService  extends IService<Bed> {

    //查询床位
    String getBedPath(Long bedId);
}
