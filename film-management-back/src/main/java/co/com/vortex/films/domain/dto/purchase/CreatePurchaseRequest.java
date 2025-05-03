package co.com.vortex.films.domain.dto.purchase;

import co.com.vortex.films.domain.dto.purchasedetail.CreatePurchaseDetailRequest;
import co.com.vortex.films.domain.models.PaymentMethod;
import co.com.vortex.films.domain.validators.PurchaseValidator;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Builder
@Data
public class CreatePurchaseRequest {
    @NotNull(message = PurchaseValidator.USER_ID_NOT_NULL)
    @Min(value = 1, message = PurchaseValidator.USER_ID_POSITIVE)
    private Long userId;

    @NotNull(message = PurchaseValidator.PAYMENT_METHOD_NOT_NULL)
    private PaymentMethod paymentMethod;

    @NotNull(message = PurchaseValidator.DETAILS_NOT_NULL)
    @NotEmpty(message = PurchaseValidator.DETAILS_NOT_EMPTY)
    @Valid
    private List<CreatePurchaseDetailRequest> details;
}
