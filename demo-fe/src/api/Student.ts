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
    return request.post<string>('/student',data);
}

//修改学生
export function updateStudent(data: StudentSave){
    return request.put<void>('/student',data);
}

//删除学生
export function batchDeleteStudents(ids:string[]){
    return request.delete<void>('/student',{params:{ids:ids.join(',')}})
}

//分配床位
export function assignBed(data: AssignBed){
    return request.post<AssignBedResult>('/student/assign-bed',data);
}

// 查询床位路径
  export function getBedPath(bedId: string){
      return request.get<string>(`/bed/${bedId}/path`);
  }

// 学生自选床位
  export function selectBed(bedId: string) {
    return request.post<string>(`/bed/select/${bedId}`);
  }
