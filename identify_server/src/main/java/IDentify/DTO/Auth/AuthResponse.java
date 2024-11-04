package IDentify.DTO.Auth;

import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class AuthResponse {
    private boolean success;
    private String error;
    private String token;
    private long id;

    public AuthResponse(boolean success, String token, Long userId) {
        this.success = success;
        this.token = token;
        this.id = userId;
        this.error = null;
    }

    public AuthResponse(boolean success, String error) {
        this.success = success;
        this.error = error;
        this.token = null;
        this.id = 0;
    }
}