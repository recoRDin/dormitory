package com.example.demo.common.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
    private  static final String SECRET = "Ym9sdC1mcmVlLXNlY3VyZS1hdXRoLWZvci1iaW4tZGV2ZWxvcG1lbnQ=";
    private  static  final long EXPIRE_TIME = 3600 * 1000;

    public static String createToken(Map<String, Object> claims, String subject){
        SecretKeySpec key = new SecretKeySpec(Base64.getDecoder().decode(SECRET), "HmacSHA256");

        return Jwts.builder()
                .setClaims(claims)      // 放入租户ID、用户ID等负载
                .setSubject(subject)    // 放入账号名
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
