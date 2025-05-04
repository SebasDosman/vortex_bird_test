package co.com.vortex.films.application.controller;

import co.com.vortex.films.application.service.IUserService;
import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import co.com.vortex.films.domain.dto.user.UpdateUserRequest;
import co.com.vortex.films.domain.dto.user.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
@Tag(name = "User", description = "Endpoints for managing users")
@SecurityRequirement(name = "bearer-key")
public class UserController {
    private final IUserService userService;

    @Operation(summary = "Get all users", description = "Retrieves a paginated list of all users.")
    @GetMapping()
    public ResponseEntity<Slice<UserResponse>> findAll(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(userService.findAll(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get all users enabled", description = "Retrieves a paginated list of all enabled users.")
    @GetMapping("/enabled")
    public ResponseEntity<Slice<UserResponse>> findAllEnabled(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(userService.findAllEnabled(pageable), HttpStatus.OK);
    }

    @Operation(summary = "Get user by ID", description = "Retrieves a user by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }

    @Operation(summary = "Get user by email", description = "Retrieves a user by their email address.")
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> findByEmail(@PathVariable String email) {
        return new ResponseEntity<>(userService.findByEmail(email), HttpStatus.OK);
    }

    @Operation(summary = "User registration", description = "Registers a new user in the system.")
    @PostMapping()
    public ResponseEntity<UserResponse> save(@RequestBody @Valid CreateUserRequest createUserRequest) {
        return new ResponseEntity<>(userService.save(createUserRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Update user", description = "Updates an existing users information.")
    @PutMapping()
    public ResponseEntity<UserResponse> update(@RequestBody @Valid UpdateUserRequest updateUserRequest) {
        return new ResponseEntity<>(userService.update(updateUserRequest), HttpStatus.OK);
    }

    @Operation(summary = "Update user status", description = "Updates the status of a user.")
    @PutMapping("/admin/{id}")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id) {
        return new ResponseEntity<>(userService.updateStatus(id), HttpStatus.OK);
    }

    @Operation(summary = "Delete user", description = "Deletes a user by their unique ID.")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
