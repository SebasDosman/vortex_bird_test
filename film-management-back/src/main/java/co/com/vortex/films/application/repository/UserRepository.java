package co.com.vortex.films.application.repository;

import co.com.vortex.films.domain.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Slice<User> findAllByEnabledTrue(Pageable pageable);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
