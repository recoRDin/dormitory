"use client";

import { create } from "zustand";
import { SysMenu } from "@/types/system";
import { persist, createJSONStorage } from "zustand/middleware";


interface AuthState {

    tenantId: string;
    menuList: SysMenu[];
    permissions: string[];

    setTenantId: (tenantId: string) => void;
    setAuthData: (menuList: SysMenu[], permissions: string[]) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(

    persist(
        (set) => ({
            tenantId: '000000',
            menuList: [],
            permissions: [],

            setTenantId: (tenantId) => set({ tenantId }),
            setAuthData: (menuList, permissions) => set({ menuList, permissions }),
            clearAuth: () => set({ menuList: [], permissions: [] }),
        }),
        {
            name: 'auth-storage', 
            storage: createJSONStorage(() => localStorage),
      
            partialize: (state): Partial<AuthState> => ({ tenantId: state.tenantId }),
        }
    )
);   
