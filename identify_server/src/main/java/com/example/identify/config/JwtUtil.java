package com.example.identify.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwtSecret}")
    private String SECRET_KEY;

    // Token expiration time in milliseconds (1 hour here)
    private final long JWT_EXPIRATION_TIME = 1000 * 60 * 60 * 5;

    public String generateToken(Long userId) {
        return JWT.create()
                .withSubject("User")
                .withClaim("UserId", userId)
                .withExpiresAt(new Date(System.currentTimeMillis() + JWT_EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public Long getUserIdFromToken(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaim("UserId").asLong();
    }

    public boolean isTokenValid(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (isTokenExpired(decodedJWT)) {
                return false;
            }
            Long userId = decodedJWT.getClaim("UserId").asLong();
            return userId != null;
        } catch (Exception e) {
            return false;
        }
    }

    private DecodedJWT decodeToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY)).build();
        return verifier.verify(token);
    }

    private boolean isTokenExpired(DecodedJWT decodedJWT) {
        Date expiration = decodedJWT.getExpiresAt();
        return expiration != null && expiration.before(new Date());
    }
}