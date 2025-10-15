package realtime.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for user login")
public class LoginRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username", example = "john_doe")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Schema(description = "Password", example = "mySecurePassword123")
    private String password;
}
