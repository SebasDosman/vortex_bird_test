package co.com.vortex.films.domain.dto.purchasedetail;

import co.com.vortex.films.domain.validators.PurchaseDetailValidator;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class CreatePurchaseDetailRequest {
    @NotNull(message = PurchaseDetailValidator.FILM_ID_NOT_NULL)
    @Min(value = 1, message = PurchaseDetailValidator.FILM_ID_POSITIVE)
    private Long filmId;

    @NotNull(message = PurchaseDetailValidator.QUANTITY_NOT_NULL)
    @Min(value = 1, message = PurchaseDetailValidator.QUANTITY_MIN)
    private Integer quantity;

    @NotNull(message = PurchaseDetailValidator.UNIT_PRICE_NOT_NULL)
    @Min(value = 1, message = PurchaseDetailValidator.UNIT_PRICE_MIN)
    private Integer unitPrice;
}
