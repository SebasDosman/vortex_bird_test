package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.FilmRepository;
import co.com.vortex.films.application.service.IFilmService;
import co.com.vortex.films.application.service.IFirebaseStorageService;
import co.com.vortex.films.domain.dto.film.CreateFilmRequest;
import co.com.vortex.films.domain.dto.film.FilmResponse;
import co.com.vortex.films.domain.dto.film.UpdateFilmRequest;
import co.com.vortex.films.domain.mappers.FilmMapper;
import co.com.vortex.films.domain.models.Film;
import co.com.vortex.films.domain.validators.FilmValidator;
import co.com.vortex.films.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;

@RequiredArgsConstructor
@Service
public class FilmService implements IFilmService {
    private final FilmRepository filmRepository;
    private final IFirebaseStorageService firebaseStorageService;

    @Override
    @Transactional(readOnly = true)
    public Slice<FilmResponse> findAll(Pageable pageable) {
        return FilmMapper.toFilmResponseSlice(filmRepository.findAll(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<FilmResponse> findAllEnabled(Pageable pageable) {
        return FilmMapper.toFilmResponseSlice(filmRepository.findAllByEnabledTrue(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public FilmResponse findById(Long id) {
        if (!filmRepository.existsById(id)) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND, id));

        return FilmMapper.toFilmResponse(filmRepository.getReferenceById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public FilmResponse findByTitle(String title) {
        if (!filmRepository.existsByTitle(title)) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND_BY_TITLE, title));

        return FilmMapper.toFilmResponse(filmRepository.findByTitle(title));
    }

    @Override
    @Transactional
    public FilmResponse save(CreateFilmRequest createFilmRequest, MultipartFile image, String folder) throws IOException {
        URL imageUrl = firebaseStorageService.uploadFile(image, folder);

        return FilmMapper.toFilmResponse(filmRepository.save(FilmMapper.toFilm(createFilmRequest, imageUrl.toString())));
    }

    @Override
    @Transactional
    public FilmResponse update(UpdateFilmRequest updateFilmRequest) {
        if (!filmRepository.existsById(updateFilmRequest.getId())) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND, updateFilmRequest.getId()));

        Film savedFilm = filmRepository.getReferenceById(updateFilmRequest.getId());

        return FilmMapper.toFilmResponse(filmRepository.save(FilmMapper.toFilm(updateFilmRequest, savedFilm.isEnabled())));
    }

    @Override
    @Transactional
    public FilmResponse updateStatus(Long id) {
        if (!filmRepository.existsById(id)) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND, id));

        Film film = filmRepository.getReferenceById(id);
        film.setEnabled(!film.isEnabled());

        return FilmMapper.toFilmResponse(filmRepository.save(film));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!filmRepository.existsById(id)) throw new NotFoundException(String.format(FilmValidator.FILM_NOT_FOUND, id));

        filmRepository.deleteById(id);
    }
}
