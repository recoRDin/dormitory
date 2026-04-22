package com.example.demo.framework.secure;

import com.example.demo.common.entity.IUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    // 必须和 JwtUtil 里的密钥一模一样！
    private static final String SECRET = "Ym9sdC1mcmVlLXNlY3VyZS1hdXRoLWZvci1iaW4tZGV2ZWxvcG1lbnQ=";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 从 Header 获取 Token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("bearer ")) {
        token = token.substring(7);
        }
        // 如果没有 Token，直接拦住并返回 401
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            response.getWriter().write("No Token, No Entry!");
            return false;
        }

        try {
            // 2. 解析 JWT
            SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET));
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 3. 将解析出的身份存入 UserContext (ThreadLocal)
            // 使用动态代理创建 IUser 实例，避免依赖具体实现类
            IUser user = new IUser() {
                private Long id;
                private String tenantId;
                private String account;
                
                @Override
                public Long getId() { return id; }
                @Override
                public void setId(Long id) { this.id = id; }
                @Override
                public String getTenantId() { return tenantId; }
                @Override
                public void setTenantId(String tenantId) { this.tenantId = tenantId; }
                @Override
                public String getAccount() { return account; }
                @Override
                public void setAccount(String account) { this.account = account; }
            };
            
            user.setId(Long.valueOf(claims.get("user_id").toString()));
            user.setTenantId(claims.get("tenant_id").toString());
            user.setAccount(claims.getSubject());

            UserContext.setUser(user); // 塞进口袋
            return true; // 放行

        } catch (Exception e) {
            response.setStatus(401);
            response.getWriter().write("Invalid Token!");
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 4. 请求结束，一定要清理口袋，防止线程污染
        UserContext.clear();
    }
}
