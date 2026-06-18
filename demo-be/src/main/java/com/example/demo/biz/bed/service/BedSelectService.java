package com.example.demo.biz.bed.service;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.demo.biz.bed.entity.Bed;
import com.example.demo.biz.bed.mapper.BedMapper;
import com.example.demo.biz.room.entity.Room;
import com.example.demo.biz.room.mapper.RoomMapper;
import com.example.demo.biz.student.entity.Student;
import com.example.demo.biz.student.mapper.StudentMapper;
import com.example.demo.common.exception.BusinessException;
import com.example.demo.framework.redis.RedisUtils;
import com.example.demo.framework.secure.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BedSelectService {

    private final BedMapper bedMapper;
    private final StudentMapper studentMapper;
    private final RoomMapper roomMapper;
    private final RedisUtils redisUtils;

    private static final String STOCK_PREFIX = "stock:bed:";

    //初始化库存
    public void initStock() {
        List<Bed> freeBed = bedMapper.selectList(
                new LambdaQueryWrapper<Bed>().eq(Bed::getStatus, 0)
        );
        for (Bed bed : freeBed) {
            redisUtils.setInt(STOCK_PREFIX + bed.getId(), 1);
        }
    }

    //选床
    @Transactional(rollbackFor = Exception.class)
    public String selectBed(Long bedID){
        //根据当前账号找到学生
        String account = UserContext.getUser().getAccount();
        Student student = studentMapper.selectOne(
                new LambdaQueryWrapper<Student>().eq(Student::getStudentNo, account)
        );
        if (student == null) {
            throw new BusinessException("未找到你的学生信息");
        }
        if (student.getBedId() != null) {
            throw new BusinessException("你已经选过床位了");
        }

        //原子扣库存
        String redisKey = STOCK_PREFIX + bedID;
        Long remain = redisUtils.decr(redisKey);

        if (remain<0){
            redisUtils.incr(redisKey);//回滚
            throw new BusinessException("该床位已被抢走");
        }

        //查床位状态（乐观锁）
        Bed bed = bedMapper.selectById(bedID);
        if (bed == null || bed.getStatus()!=0){
            redisUtils.incr(redisKey);//回滚
            throw new BusinessException("床位异常");
        }

        //更新床位（乐观锁）
        bed.setStatus(1);
        int rows = bedMapper.updateById(bed);
        if (rows == 0) {
            redisUtils.incr(redisKey);  // 回滚
            throw new BusinessException("并发冲突，请重试");
        }

        //  更新学生的床位
        student.setBedId(bedID);
        studentMapper.updateById(student);

        //  更新房间人数
        Room room = roomMapper.selectById(bed.getRoomId());
        room.setCurrentCount(room.getCurrentCount() + 1);
        roomMapper.updateById(room);

        return "选床成功";
    }
}
