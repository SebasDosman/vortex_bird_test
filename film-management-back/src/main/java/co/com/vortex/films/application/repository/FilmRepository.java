package co.com.vortex.films.application.repository;

import co.com.vortex.films.domain.models.Film;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long> {
    Slice<Film> findAllByEnabledTrue(Pageable pageable);
    Slice<Film> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
