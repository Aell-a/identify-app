package IDentify.DTO.Auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequest {
    private String nickname;
    private String email;
    private String password;

}
