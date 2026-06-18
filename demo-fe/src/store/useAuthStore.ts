"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MenuProps } from "antd";
import { RoleCode, getSideMenus } from "@/utils/permission";

interface AuthState {

    tenantId: string;
    roleId: number | null;
    roleCode: RoleCode | null;
    account: string | null;
    sideMenus: MenuProps['items'];
    permissions: string[];

    setTenantId: (tenantId: string) => void;
    setRole: (roleId: number, roleCode: RoleCode, tenantId?: string, account?: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(

    persist(
        (set) => ({
            tenantId: '000000',
            roleId: null,
            roleCode: null,
            account: null,
            sideMenus: [],
            permissions: [],

            setTenantId: (tenantId) => set({ tenantId }),

            setRole: (roleId, roleCode, tenantId, account) => set({
                roleId,
                roleCode,
                tenantId: tenantId || '000000',
                account: account || null,
                sideMenus: getSideMenus(roleCode),
            }),

            clearAuth: () => set({
                roleId: null,
                roleCode: null,
                account: null,
                sideMenus: [],
                permissions: [],
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),

            partialize: (state): Partial<AuthState> => ({
                account: state.account,
                tenantId: state.tenantId,
                roleId: state.roleId,
                roleCode: state.roleCode,
            }),

            onRehydrateStorage: () => (state) => {
                if (state) {
                    if (state.roleCode) {
                        state.sideMenus = getSideMenus(state.roleCode);
                    }
                    if (!state.account) {
                        // 兜底：从 cookie 的 JWT 中提取账号
                        try {
                            const cookie = document.cookie.split('; ').find(r => r.startsWith('token='));
                            if (cookie) {
                                const token = cookie.split('=').slice(1).join('=');
                                const payload = JSON.parse(atob(token.split('.')[1]));
                                state.account = payload.account || null;
                            }
                        } catch { /* ignore */ }
                    }
                }
            },
        }
    )
);
