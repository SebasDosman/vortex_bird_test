package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.film.CreateFilmRequest;
import co.com.vortex.films.domain.dto.film.UpdateFilmRequest;
import co.com.vortex.films.domain.dto.film.FilmResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFilmService {
    Slice<FilmResponse> findAll(Pageable pageable);
    Slice<FilmResponse> findAllEnabled(Pageable pageable);
    FilmResponse findById(Long id);
    FilmResponse findByTitle(String title);
    FilmResponse save(CreateFilmRequest createFilmRequest, MultipartFile image, String folder) throws IOException;
    FilmResponse update(UpdateFilmRequest updateFilmRequest);
    FilmResponse updateStatus(Long id);
    void delete(Long id);
}
