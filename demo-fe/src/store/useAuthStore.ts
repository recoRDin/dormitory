"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MenuProps } from "antd";
import { RoleCode, getSideMenus } from "@/utils/permission";

interface AuthState {

    tenantId: string;
    roleId: number | null;
    roleCode: RoleCode | null;
    sideMenus: MenuProps['items'];
    permissions: string[];

    setTenantId: (tenantId: string) => void;
    setRole: (roleId: number, roleCode: RoleCode, tenantId?: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(

    persist(
        (set) => ({
            tenantId: '000000',
            roleId: null,
            roleCode: null,
            sideMenus: [],
            permissions: [],

            setTenantId: (tenantId) => set({ tenantId }),

            setRole: (roleId, roleCode, tenantId) => set({
                roleId,
                roleCode,
                tenantId,
                sideMenus: getSideMenus(roleCode),
            }),

            clearAuth: () => set({
                roleId: null,
                roleCode: null,
                sideMenus: [],
                permissions: [],
            }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),

            partialize: (state): Partial<AuthState> => ({
                tenantId: state.tenantId,
                roleId: state.roleId,
                roleCode: state.roleCode,
            }),

            onRehydrateStorage: () => (state) => {
                if (state && state.roleCode) {
                    state.sideMenus = getSideMenus(state.roleCode);
                }
            },
        }
    )
);
