package co.com.vortex.films.domain.dto.user;

import co.com.vortex.films.domain.validators.UserValidator;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class UpdateUserRequest {
    @NotNull(message = UserValidator.ID_NOT_NULL)
    @Min(value = 1, message = UserValidator.ID_POSITIVE)
    private Long id;

    @NotBlank(message = UserValidator.NAME_NOT_BLANK)
    @Pattern(regexp = UserValidator.NAME_REGEX, message = UserValidator.NAME_PATTERN)
    @Size(min = 1, max = 100, message = UserValidator.NAME_SIZE)
    private String name;

    @NotBlank(message = UserValidator.LAST_NAME_NOT_BLANK)
    @Pattern(regexp = UserValidator.LAST_NAME_REGEX, message = UserValidator.LAST_NAME_PATTERN)
    @Size(min = 1, max = 100, message = UserValidator.LAST_NAME_SIZE)
    private String lastName;

    @NotBlank(message = UserValidator.PHONE_NOT_BLANK)
    @Pattern(regexp = UserValidator.PHONE_REGEX, message = UserValidator.PHONE_PATTERN)
    @Size(min = 1, max = 10, message = UserValidator.PHONE_SIZE)
    private String phone;

    @Email(message = UserValidator.EMAIL_PATTERN)
    @NotBlank(message = UserValidator.EMAIL_NOT_BLANK)
    @Size(min = 1, max = 150, message = UserValidator.EMAIL_SIZE)
    private String email;

    @NotBlank(message = UserValidator.PASSWORD_NOT_BLANK)
    @Pattern(regexp = UserValidator.PASSWORD_REGEX, message = UserValidator.PASSWORD_PATTERN)
    @Size(min = 1, max = 50, message = UserValidator.PASSWORD_SIZE)
    private String password;
}
