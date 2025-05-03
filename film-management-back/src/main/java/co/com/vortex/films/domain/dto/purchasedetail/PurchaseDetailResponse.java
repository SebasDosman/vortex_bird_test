package co.com.vortex.films.domain.dto.purchasedetail;

import co.com.vortex.films.domain.dto.film.FilmResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class PurchaseDetailResponse {
    private Long id;
    private FilmResponse film;
    private Integer quantity;
    private Integer unitPrice;
}
