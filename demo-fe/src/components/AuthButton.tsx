'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { Button,ButtonProps } from "antd";

interface AuthButtonProps extends ButtonProps {
    authCode: string;
}

export const AuthButton = (props: AuthButtonProps) => {

    const { authCode, ...restProps } = props;
    const permissions = useAuthStore((state) => state.permissions);

    if (!permissions.includes(authCode)) {
        return null;
    }

    return <Button {...restProps} />;
}