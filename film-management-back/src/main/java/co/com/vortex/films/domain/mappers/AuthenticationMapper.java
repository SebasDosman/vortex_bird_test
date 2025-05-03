package co.com.vortex.films.domain.mappers;

import co.com.vortex.films.domain.dto.authentication.AuthenticationResponse;
import co.com.vortex.films.domain.models.User;

public class AuthenticationMapper {
    public static AuthenticationResponse toAuthenticationResponse(String token, User user, String tokenType, Long expiresIn) throws Exception {
        return AuthenticationResponse.builder()
                .accessToken(token)
                .tokenType(tokenType)
                .expiresIn(expiresIn)
                .user(UserMapper.toUserResponse(user))
                .build();
    }
}
