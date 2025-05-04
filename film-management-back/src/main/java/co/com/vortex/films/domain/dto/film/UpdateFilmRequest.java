package co.com.vortex.films.domain.dto.film;

import co.com.vortex.films.domain.models.FilmClassification;
import co.com.vortex.films.domain.models.FilmGenre;
import co.com.vortex.films.domain.validators.FilmValidator;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class UpdateFilmRequest {
    @NotNull(message = FilmValidator.ID_NOT_NULL)
    @Min(value = 1, message = FilmValidator.ID_POSITIVE)
    private Long id;

    @NotBlank(message = FilmValidator.TITLE_NOT_BLANK)
    @Pattern(regexp = FilmValidator.TITLE_REGEX, message = FilmValidator.TITLE_PATTERN)
    @Size(min = 1, max = 255, message = FilmValidator.TITLE_SIZE)
    private String title;

    @NotBlank(message = FilmValidator.DESCRIPTION_NOT_BLANK)
    @Size(min = 1, max = 500, message = FilmValidator.DESCRIPTION_SIZE)
    private String description;

    @NotNull(message = FilmValidator.GENRE_NOT_NULL)
    private FilmGenre genre;

    @NotNull(message = FilmValidator.CLASSIFICATION_NOT_NULL)
    private FilmClassification classification;

    @NotNull(message = FilmValidator.DURATION_NOT_NULL)
    @Min(value = 1, message = FilmValidator.DURATION_POSITIVE)
    private Integer duration;

    @NotNull(message = FilmValidator.TICKET_PRICE_NOT_NULL)
    @Min(value = 1, message = FilmValidator.TICKET_PRICE_MIN)
    private Integer ticketPrice;
}
