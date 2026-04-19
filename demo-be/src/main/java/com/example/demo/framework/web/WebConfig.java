package com.example.demo.framework.web;

import com.example.demo.framework.secure.AuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
//        TODO:临时关闭认证
//        registry.addInterceptor(authInterceptor)
//                .addPathPatterns("/**")             // 拦截所有路径
//                .excludePathPatterns("/auth/login")// 排除登录接口，否则没法领证
//                .excludePathPatterns("/test/user/list")
//                .excludePathPatterns("/redis-test")
//                .order(1);
    }
}