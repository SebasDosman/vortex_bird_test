package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.UserRepository;
import co.com.vortex.films.application.service.IUserService;
import co.com.vortex.films.domain.dto.user.CreateUserRequest;
import co.com.vortex.films.domain.dto.user.UpdateUserRequest;
import co.com.vortex.films.domain.dto.user.UserResponse;
import co.com.vortex.films.domain.mappers.UserMapper;
import co.com.vortex.films.domain.models.User;
import co.com.vortex.films.domain.validators.UserValidator;
import co.com.vortex.films.infrastructure.exceptions.ConflictException;
import co.com.vortex.films.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Slice<UserResponse> findAll(Pageable pageable) {
        return UserMapper.toUserResponseSlice(userRepository.findAll(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<UserResponse> findAllEnabled(Pageable pageable) {
        return UserMapper.toUserResponseSlice(userRepository.findAllByEnabledTrue(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        if (!userRepository.existsById(id)) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND, id));

        return UserMapper.toUserResponse(userRepository.getReferenceById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email) {
        if (!userRepository.existsByEmail(email)) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND_BY_EMAIL, email));

        return UserMapper.toUserResponse(userRepository.findByEmail(email));
    }

    @Override
    @Transactional
    public UserResponse save(CreateUserRequest createUserRequest) {
        if (userRepository.existsByPhone(createUserRequest.getPhone())) throw new ConflictException(String.format(UserValidator.PHONE_ALREADY_EXISTS, createUserRequest.getPhone()));
        if (userRepository.existsByEmail(createUserRequest.getEmail())) throw new ConflictException(String.format(UserValidator.EMAIL_ALREADY_EXISTS, createUserRequest.getEmail()));

        return UserMapper.toUserResponse(userRepository.save(UserMapper.toUser(createUserRequest, bCryptPasswordEncoder.encode(createUserRequest.getPassword()))));
    }

    @Override
    @Transactional
    public UserResponse update(UpdateUserRequest updateUserRequest) {
        if (!userRepository.existsById(updateUserRequest.getId())) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND, updateUserRequest.getId()));

        User savedUser = userRepository.getReferenceById(updateUserRequest.getId());
        if (!savedUser.getPhone().equals(updateUserRequest.getPhone()) && userRepository.existsByPhone(updateUserRequest.getPhone())) throw new ConflictException(String.format(UserValidator.PHONE_ALREADY_EXISTS, updateUserRequest.getPhone()));
        if (!savedUser.getEmail().equals(updateUserRequest.getEmail()) && userRepository.existsByEmail(updateUserRequest.getEmail())) throw new ConflictException(String.format(UserValidator.EMAIL_ALREADY_EXISTS, updateUserRequest.getEmail()));

        return UserMapper.toUserResponse(userRepository.save(UserMapper.toUser(updateUserRequest, bCryptPasswordEncoder.encode(updateUserRequest.getPassword()), savedUser.getRole(), savedUser.isEnabled())));
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id) {
        if (!userRepository.existsById(id)) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND, id));

        User user = userRepository.getReferenceById(id);
        user.setEnabled(!user.isEnabled());

        return UserMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND, id));

        userRepository.deleteById(id);
    }
}
