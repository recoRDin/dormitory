import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { BuildingInfo, BuildingQuery, BuildingSave } from '@/types/building';

export function getBuildingPage(params: BuildingQuery) {
  return request.get<PageResult<BuildingInfo>>('/building/page', { params });
}

export function getBuildingList() {
  return request.get<BuildingInfo[]>('/building/list');
}

export function addBuilding(data: BuildingSave) {
  return request.post<string>('/building', data);
}

export function updateBuilding(data: BuildingSave) {
  return request.put<void>('/building', data);
}

export function batchDeleteBuildings(ids: string[]) {
  return request.delete<void>('/building', { params: { ids: ids.join(',') } });
}
