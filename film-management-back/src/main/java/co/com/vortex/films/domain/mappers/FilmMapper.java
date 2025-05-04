package co.com.vortex.films.domain.mappers;

import co.com.vortex.films.domain.dto.film.CreateFilmRequest;
import co.com.vortex.films.domain.dto.film.FilmResponse;
import co.com.vortex.films.domain.dto.film.UpdateFilmRequest;
import co.com.vortex.films.domain.models.Film;
import org.springframework.data.domain.Slice;

public class FilmMapper {
    public static FilmResponse toFilmResponse(Film film) {
        return FilmResponse.builder()
                .id(film.getId())
                .title(film.getTitle())
                .description(film.getDescription())
                .imageUrl(film.getImageUrl())
                .genre(film.getGenre().toString())
                .classification(film.getClassification().toString())
                .duration(film.getDuration())
                .enabled(film.isEnabled())
                .build();
    }

    public static Film toFilm(CreateFilmRequest createFilmRequest, String imageUrl) {
        return Film.builder()
                .title(createFilmRequest.getTitle())
                .description(createFilmRequest.getDescription())
                .imageUrl(imageUrl)
                .genre(createFilmRequest.getGenre())
                .classification(createFilmRequest.getClassification())
                .duration(createFilmRequest.getDuration())
                .build();
    }

    public static Film toFilm(UpdateFilmRequest updateFilmRequest, String imageUrl, boolean enabled) {
        return Film.builder()
                .id(updateFilmRequest.getId())
                .title(updateFilmRequest.getTitle())
                .description(updateFilmRequest.getDescription())
                .imageUrl(imageUrl)
                .genre(updateFilmRequest.getGenre())
                .classification(updateFilmRequest.getClassification())
                .duration(updateFilmRequest.getDuration())
                .enabled(enabled)
                .build();
    }

    public static Slice<FilmResponse> toFilmResponseSlice(Slice<Film> films) {
        return films.map(FilmMapper::toFilmResponse);
    }
}
