import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { ClassInfo, ClassQuery, ClassSave } from '@/types/class';

export function getClassPage(params: ClassQuery) {
  return request.get<PageResult<ClassInfo>>('/class/page', { params });
}

export function getClassList() {
  return request.get<ClassInfo[]>('/class/list');
}

export function addClass(data: ClassSave) {
  return request.post<string>('/class', data);
}

export function updateClass(data: ClassSave) {
  return request.put<void>('/class', data);
}

export function batchDeleteClasses(ids: string[]) {
  return request.delete<void>('/class', { params: { ids: ids.join(',') } });
}
