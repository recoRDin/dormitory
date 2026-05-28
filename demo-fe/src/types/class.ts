export interface ClassInfo {
  id: string;
  major: string;
  grade: string;
  className: string;
  counselorUserId: string;
  createTime: string;
  updateTime: string;
}

export interface ClassSave {
  id?: string;
  major: string;
  grade: string;
  className: string;
  counselorUserId: string;
}

export interface ClassQuery {
  major?: string;
  grade?: string;
  className?: string;
  current?: number;
  size?: number;
}
