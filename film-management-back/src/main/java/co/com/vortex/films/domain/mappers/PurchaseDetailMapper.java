package co.com.vortex.films.domain.mappers;

import co.com.vortex.films.domain.dto.purchasedetail.CreatePurchaseDetailRequest;
import co.com.vortex.films.domain.dto.purchasedetail.PurchaseDetailResponse;
import co.com.vortex.films.domain.dto.purchasedetail.UpdatePurchaseDetailRequest;
import co.com.vortex.films.domain.models.Film;
import co.com.vortex.films.domain.models.PurchaseDetail;
import org.springframework.data.domain.Slice;

import java.util.List;

public class PurchaseDetailMapper {
    public static PurchaseDetailResponse toPurchaseDetailResponse(PurchaseDetail purchaseDetail) {
        return PurchaseDetailResponse.builder()
                .id(purchaseDetail.getId())
                .film(FilmMapper.toFilmResponse(purchaseDetail.getFilm()))
                .quantity(purchaseDetail.getQuantity())
                .unitPrice(purchaseDetail.getUnitPrice())
                .build();
    }

    public static PurchaseDetail toPurchaseDetail(CreatePurchaseDetailRequest createPurchaseDetailRequest, Film film) {
        return PurchaseDetail.builder()
                .film(film)
                .quantity(createPurchaseDetailRequest.getQuantity())
                .unitPrice(createPurchaseDetailRequest.getUnitPrice())
                .build();
    }

    public static PurchaseDetail toPurchaseDetail(UpdatePurchaseDetailRequest updatePurchaseDetailRequest, Film film) {
        return PurchaseDetail.builder()
                .id(updatePurchaseDetailRequest.getId())
                .film(film)
                .quantity(updatePurchaseDetailRequest.getQuantity())
                .unitPrice(updatePurchaseDetailRequest.getUnitPrice())
                .build();
    }

    public static Slice<PurchaseDetailResponse> toPurchaseDetailResponseSlice(Slice<PurchaseDetail> purchaseDetails) {
        return purchaseDetails.map(PurchaseDetailMapper::toPurchaseDetailResponse);
    }

    public static List<PurchaseDetailResponse> toPurchaseDetailResponseList(List<PurchaseDetail> purchaseDetails) {
        return purchaseDetails.stream().map(PurchaseDetailMapper::toPurchaseDetailResponse).toList();
    }
}
