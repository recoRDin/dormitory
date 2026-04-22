import request from '@/utils/request';

import type {
    PageResult,
    Student,
    StudentQuery,
    StudentSave,
    AssignBed,
    AssignBedResult,
  } from '@/types/student';


//分页查询
export function getStudentPage(params: StudentQuery){
    return request.get<PageResult<Student>>('/student/page',{params});
  }

//新增学生
export function addStudent(data:StudentSave){
    return request.post<number>('/student',data);
}

//修改学生
export function updateStudent(data: StudentSave){
    return request.put<void>('/student',data);
}

//删除学生
export function batchDeleteStudents(ids:(number|string)[]){
    return request.delete<void>('/student',{params:{ids:ids.join(',')}})
}

//分配床位
export function assignBed(data: AssignBed){
    return request.post<AssignBedResult>('/student/assign-bed',data);
}