import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const whiteList = ['/login', '/register', '/404', '/403', '/500'];

export function middleware(request: NextRequest){
    //获取token
    const token = request.cookies.get('token')?.value;
    //获取路径
    const currentPath = request.nextUrl.pathname;

    if (whiteList.includes(currentPath)) {
    
        // 没登录访问白名单，正常放行
        return NextResponse.next();
    }

    // 如果用户访问的是受保护的页面，且没有 Token
    if (!token) {
        // 把用户原本想去的路径，塞进 URL 参数里
        const loginUrl = new URL('/login', request.url);
        
        loginUrl.searchParams.set('redirect', currentPath); 
        
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};