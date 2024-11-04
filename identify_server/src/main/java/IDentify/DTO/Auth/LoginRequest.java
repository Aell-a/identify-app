package IDentify.DTO.Auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;
    private String password;
}
