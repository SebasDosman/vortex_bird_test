package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.authentication.AuthenticationRequest;
import co.com.vortex.films.domain.dto.authentication.AuthenticationResponse;
import co.com.vortex.films.domain.dto.user.CreateUserRequest;

public interface IAuthenticationService {
    AuthenticationResponse signIn(AuthenticationRequest authenticationRequest) throws Exception;
    AuthenticationResponse signUp(CreateUserRequest createUserRequest) throws Exception;
}
