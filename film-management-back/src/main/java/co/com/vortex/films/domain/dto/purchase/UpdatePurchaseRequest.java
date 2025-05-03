package co.com.vortex.films.domain.dto.purchase;

import co.com.vortex.films.domain.models.PaymentMethod;
import co.com.vortex.films.domain.models.PaymentStatus;
import co.com.vortex.films.domain.validators.PurchaseValidator;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class UpdatePurchaseRequest {
    @NotNull(message = PurchaseValidator.ID_NOT_NULL)
    @Min(value = 1, message = PurchaseValidator.ID_POSITIVE)
    private Long id;

    @NotNull(message = PurchaseValidator.USER_ID_NOT_NULL)
    @Min(value = 1, message = PurchaseValidator.USER_ID_POSITIVE)
    private Long userId;

    @NotNull(message = PurchaseValidator.PAYMENT_METHOD_NOT_NULL)
    private PaymentMethod paymentMethod;

    @NotNull(message = PurchaseValidator.PAYMENT_STATUS_NOT_NULL)
    private PaymentStatus paymentStatus;
}
