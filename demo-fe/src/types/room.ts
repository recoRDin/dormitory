export interface RoomInfo {
  id: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  roomType: string;
  capacity: number;
  currentCount: number;
  headStudentId: string | null;
  createTime: string;
  updateTime: string;
}

export interface BedInfo {
  id: string;
  roomId: string;
  bedNo: number;
  status: number;
}

export interface RoomSave {
  id?: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  roomType?: string;
  capacity: number;
  headStudentId?: string;
}

export interface RoomQuery {
  buildingId?: string;
  floor?: number;
  roomNo?: string;
  current?: number;
  size?: number;
}
