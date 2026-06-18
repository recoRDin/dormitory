package com.example.demo.framework.secure;

import com.example.demo.common.entity.IUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;

@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
        if (requireRole == null) {
            return true;
        }

        IUser user = UserContext.getUser();
        if (user == null) {
            response.setStatus(401);
            response.getWriter().write("Unauthorized");
            return false;
        }

        String userRole = user.getRoleCode();
        if (!Arrays.asList(requireRole.value()).contains(userRole)) {
            response.setStatus(403);
            response.getWriter().write("Forbidden");
            return false;
        }

        return true;
    }
}
