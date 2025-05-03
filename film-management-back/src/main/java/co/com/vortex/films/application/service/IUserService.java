package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import co.com.vortex.films.domain.dto.user.UpdateUserRequest;
import co.com.vortex.films.domain.dto.user.UserResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface IUserService {
    Slice<UserResponse> findAll(Pageable pageable);
    Slice<UserResponse> findAllEnabled(Pageable pageable);
    UserResponse findById(Long id);
    UserResponse findByEmail(String email);
    UserResponse save(CreateUserRequest createUserRequest);
    UserResponse update(UpdateUserRequest updateUserRequest);
    UserResponse updateStatus(Long id);
    void delete(Long id);
}
