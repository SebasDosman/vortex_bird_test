package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.UserRepository;
import co.com.vortex.films.domain.validators.UserValidator;
import co.com.vortex.films.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        if (!userRepository.existsByEmail(email)) throw new NotFoundException(String.format(UserValidator.USER_NOT_FOUND_BY_EMAIL, email));

        return userRepository.findByEmail(email);
    }
}
