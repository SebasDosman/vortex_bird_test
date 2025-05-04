package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.UserRepository;
import co.com.vortex.films.application.service.IAuthenticationService;
import co.com.vortex.films.application.service.ITokenService;
import co.com.vortex.films.domain.dto.authentication.AuthenticationRequest;
import co.com.vortex.films.domain.dto.authentication.AuthenticationResponse;
import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import co.com.vortex.films.domain.mappers.AuthenticationMapper;
import co.com.vortex.films.domain.mappers.UserMapper;
import co.com.vortex.films.domain.models.User;
import co.com.vortex.films.domain.validators.AuthenticationValidator;
import co.com.vortex.films.domain.validators.UserValidator;
import co.com.vortex.films.infrastructure.exceptions.ConflictException;
import co.com.vortex.films.infrastructure.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class AuthenticationService implements IAuthenticationService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final ITokenService tokenService;

    @Override
    @Transactional
    public AuthenticationResponse signIn(AuthenticationRequest authenticationRequest) throws Exception {
        if (!userRepository.existsByEmail(authenticationRequest.getEmail())) throw new UnauthorizedException(AuthenticationValidator.INCORRECT_CREDENTIALS);

        User user = userRepository.findByEmail(authenticationRequest.getEmail());
        if (!user.isEnabled()) throw new UnauthorizedException(AuthenticationValidator.USER_NOT_ENABLED);

        String token = createJwtToken(authenticationRequest);

        return AuthenticationMapper.toAuthenticationResponse(token, user, tokenService.getType(token), tokenService.getExpirationTime(token));
    }

    @Override
    @Transactional
    public AuthenticationResponse signUp(CreateUserRequest createUserRequest) throws Exception {
        if (userRepository.existsByPhone(createUserRequest.getPhone())) throw new ConflictException(String.format(UserValidator.PHONE_ALREADY_EXISTS, createUserRequest.getPhone()));
        if (userRepository.existsByEmail(createUserRequest.getEmail())) throw new ConflictException(String.format(UserValidator.EMAIL_ALREADY_EXISTS, createUserRequest.getEmail()));

        User user = UserMapper.toUser(createUserRequest, bCryptPasswordEncoder.encode(createUserRequest.getPassword()));
        User savedUser = userRepository.save(user);

        return signIn(AuthenticationRequest.builder().email(savedUser.getEmail()).password(createUserRequest.getPassword()).build());
    }

    private String createJwtToken(AuthenticationRequest authenticationRequest) {
        try {
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getEmail(),
                    authenticationRequest.getPassword()
            );

            Authentication authenticatedUser = authenticationManager.authenticate(authToken);
            User user = (User) customUserDetailsService.loadUserByUsername(authenticatedUser.getName());

            return tokenService.generateToken(user);
        } catch (Exception e) {
            throw new UnauthorizedException(AuthenticationValidator.INCORRECT_CREDENTIALS);
        }
    }
}
