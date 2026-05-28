import request from '@/utils/request';
import type { PageResult } from '@/types/student';
import type { RoomInfo, RoomQuery, RoomSave, BedInfo } from '@/types/room';

export function getRoomPage(params: RoomQuery) {
  return request.get<PageResult<RoomInfo>>('/room/page', { params });
}

export function addRoom(data: RoomSave) {
  return request.post<string>('/room', data);
}

export function updateRoom(data: RoomSave) {
  return request.put<void>('/room', data);
}

export function batchDeleteRooms(ids: string[]) {
  return request.delete<void>('/room', { params: { ids: ids.join(',') } });
}

export function getRoomBeds(roomId: string) {
  return request.get<BedInfo[]>(`/room/${roomId}/beds`);
}
