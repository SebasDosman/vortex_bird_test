package co.com.vortex.films.application.controller;

import co.com.vortex.films.application.service.IAuthenticationService;
import co.com.vortex.films.domain.dto.authentication.AuthenticationRequest;
import co.com.vortex.films.domain.dto.authentication.AuthenticationResponse;
import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/auth")
@RestController
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthenticationController {
    private final IAuthenticationService authenticationService;

    @Operation(summary = "User Login", description = "Authenticates a user using their credentials and returns a JWT token.")
    @PostMapping("/signIn")
    public ResponseEntity<AuthenticationResponse> signIn(@RequestBody @Valid AuthenticationRequest authenticationRequest) throws Exception {
        return new ResponseEntity<>(authenticationService.signIn(authenticationRequest), HttpStatus.OK);
    }

    @Operation(summary = "User Registration and Login", description = "Registers a new user and returns a JWT token.")
    @PostMapping("/signUp")
    public ResponseEntity<AuthenticationResponse > signUp(@RequestBody @Valid CreateUserRequest createUserRequest) throws Exception {
        return new ResponseEntity<>(authenticationService.signUp(createUserRequest), HttpStatus.CREATED);
    }
}
