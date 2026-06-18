import React from 'react';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  AppstoreOutlined,
  RobotOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

export type RoleCode = 'admin' | 'manager' | 'student';

interface MenuItem {
  key: string;
  icon: React.ComponentType;
  label: string;
}

const ALL_MENUS: MenuItem[] = [
  { key: '/', icon: HomeOutlined, label: '首页' },
  { key: '/student', icon: UserOutlined, label: '学生管理' },
  { key: '/class', icon: TeamOutlined, label: '班级管理' },
  { key: '/building', icon: BankOutlined, label: '楼宇管理' },
  { key: '/room', icon: AppstoreOutlined, label: '房间管理' },
  { key: '/agent', icon: RobotOutlined, label: 'AI 助手' },
  { key: '/permission', icon: SafetyOutlined, label: '权限管理' },
];

const ROLE_MENU_KEYS: Record<RoleCode, string[]> = {
  admin:   ['/', '/student', '/class', '/building', '/room', '/agent', '/permission'],
  manager: ['/', '/student', '/class', '/building', '/room', '/agent'],
  student: ['/'],
};

export function getSideMenus(roleCode: RoleCode): MenuProps['items'] {
  const allowedKeys = ROLE_MENU_KEYS[roleCode] ?? ROLE_MENU_KEYS.student;
  return ALL_MENUS
    .filter((item) => allowedKeys.includes(item.key))
    .map((item) => ({
      key: item.key,
      icon: React.createElement(item.icon),
      label: item.label,
    }));
}
