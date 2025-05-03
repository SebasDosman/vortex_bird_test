package co.com.vortex.films.domain.dto.authentication;

import co.com.vortex.films.domain.validators.UserValidator;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class AuthenticationRequest {
    @Email(message = UserValidator.EMAIL_PATTERN)
    @NotBlank(message = UserValidator.EMAIL_NOT_BLANK)
    @Size(min = 1, max = 100, message = UserValidator.EMAIL_SIZE)
    private String email;

    @NotBlank(message = UserValidator.PASSWORD_NOT_BLANK)
    @Pattern(regexp = UserValidator.PASSWORD_REGEX, message = UserValidator.PASSWORD_PATTERN)
    @Size(min = 1, max = 100, message = UserValidator.PASSWORD_SIZE)
    private String password;
}
