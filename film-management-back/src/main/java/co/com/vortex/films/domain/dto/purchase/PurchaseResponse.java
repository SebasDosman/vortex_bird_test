package co.com.vortex.films.domain.dto.purchase;

import co.com.vortex.films.domain.dto.purchasedetail.PurchaseDetailResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Builder
@Data
public class PurchaseResponse {
    private Long id;
    private Long userId;
    private LocalDateTime purchaseDate;
    private List<PurchaseDetailResponse> details;
    private Integer totalAmount;
    private String paymentStatus;
    private String paymentMethod;
}
