export interface SysMenu {
  id: string;
  parentId: string;
  name: string;
  category: 1 | 2; // 1-菜单 2-按钮
  code?: string;
  children?: SysMenu[];
}

export interface LoginDTO {
  account: string;
  password: string;
}