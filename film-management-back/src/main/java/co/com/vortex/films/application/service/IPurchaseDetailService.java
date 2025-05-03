package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.purchasedetail.PurchaseDetailResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface IPurchaseDetailService {
    Slice<PurchaseDetailResponse> findAll(Pageable pageable);
    PurchaseDetailResponse findById(Long id);
    void delete(Long id);
}
