export interface BuildingInfo {
  id: string;
  buildingName: string;
  managerUserId: string;
  createTime: string;
  updateTime: string;
}

export interface BuildingSave {
  id?: string;
  buildingName: string;
  managerUserId: string;
}

export interface BuildingQuery {
  buildingName?: string;
  current?: number;
  size?: number;
}
