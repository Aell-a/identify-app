package IDentify.Config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "your_secret_key"; // Change to a strong secret key

    public String generateToken(Long userId) {
        // 10 hours
        long JWT_EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours expiration time for a token
        return JWT.create()
                .withSubject("User")
                .withClaim("UserId", userId)
                .withExpiresAt(new Date(System.currentTimeMillis() + JWT_EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public Long getUserIdFromToken(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim("UserId").asLong();
    }

    public boolean isTokenValid(String token, Long userId) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY)).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getClaim("UserId").asLong().equals(userId);
    }
}