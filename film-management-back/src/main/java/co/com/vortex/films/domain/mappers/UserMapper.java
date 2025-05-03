package co.com.vortex.films.domain.mappers;

import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import co.com.vortex.films.domain.dto.user.UpdateUserRequest;
import co.com.vortex.films.domain.dto.user.UserResponse;
import co.com.vortex.films.domain.models.User;
import co.com.vortex.films.domain.models.UserRole;
import org.springframework.data.domain.Slice;

public class UserMapper {
    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .enabled(user.isEnabled())
                .build();
    }

    public static User toUser(CreateUserRequest createUserRequest, String password) {
        return User.builder()
                .name(createUserRequest.getName())
                .lastName(createUserRequest.getLastName())
                .phone(createUserRequest.getPhone())
                .email(createUserRequest.getEmail())
                .password(password)
                .build();
    }

    public static User toUser(UpdateUserRequest updateUserRequest, String password, UserRole role, boolean enabled) {
        return User.builder()
                .id(updateUserRequest.getId())
                .name(updateUserRequest.getName())
                .lastName(updateUserRequest.getLastName())
                .phone(updateUserRequest.getPhone())
                .email(updateUserRequest.getEmail())
                .password(password)
                .role(role)
                .enabled(enabled)
                .build();
    }

    public static Slice<UserResponse> toUserResponseSlice(Slice<User> users) {
        return users.map(UserMapper::toUserResponse);
    }
}
