package co.com.vortex.films.domain.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class UserResponse {
    private Long id;
    private String name;
    private String lastName;
    private String phone;
    private String email;
    private String role;
    private boolean enabled;
}
