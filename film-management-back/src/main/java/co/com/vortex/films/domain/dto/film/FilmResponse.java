package co.com.vortex.films.domain.dto.film;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class FilmResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String genre;
    private String classification;
    private Integer duration;
    private Integer ticketPrice;
    private boolean enabled;
}
