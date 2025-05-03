package co.com.vortex.films.domain.mappers;

import co.com.vortex.films.domain.dto.purchase.CreatePurchaseRequest;
import co.com.vortex.films.domain.dto.purchase.PurchaseResponse;
import co.com.vortex.films.domain.dto.purchase.UpdatePurchaseRequest;
import co.com.vortex.films.domain.models.Purchase;
import co.com.vortex.films.domain.models.User;
import org.springframework.data.domain.Slice;

public class PurchaseMapper {
    public static PurchaseResponse toPurchaseResponse(Purchase purchase) {
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .userId(purchase.getUser().getId())
                .purchaseDate(purchase.getPurchaseDate())
                .totalAmount(purchase.getTotalAmount())
                .paymentStatus(purchase.getPaymentStatus().toString())
                .paymentMethod(purchase.getPaymentMethod().toString())
                .details(PurchaseDetailMapper.toPurchaseDetailResponseList(purchase.getDetails()))
                .build();
    }

    public static Purchase toPurchase(CreatePurchaseRequest createPurchaseRequest, User user) {
        return Purchase.builder()
                .user(user)
                .paymentMethod(createPurchaseRequest.getPaymentMethod())
                .build();
    }

    public static Purchase toPurchase(UpdatePurchaseRequest updatePurchaseRequest, User user) {
        return Purchase.builder()
                .id(updatePurchaseRequest.getId())
                .user(user)
                .paymentStatus(updatePurchaseRequest.getPaymentStatus())
                .paymentMethod(updatePurchaseRequest.getPaymentMethod())
                .build();
    }

    public static Slice<PurchaseResponse> toPurchaseResponseSlice(Slice<Purchase> purchases) {
        return purchases.map(PurchaseMapper::toPurchaseResponse);
    }
}
