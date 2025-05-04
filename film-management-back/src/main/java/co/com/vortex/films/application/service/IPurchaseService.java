package co.com.vortex.films.application.service;

import co.com.vortex.films.domain.dto.purchase.CreatePurchaseRequest;
import co.com.vortex.films.domain.dto.purchase.PurchaseResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface IPurchaseService {
    Slice<PurchaseResponse> findAll(Pageable pageable);
    Slice<PurchaseResponse> findByUserId(Long userId, Pageable pageable);
    PurchaseResponse findById(Long id);
    PurchaseResponse save(CreatePurchaseRequest createPurchaseRequest);
    void delete(Long id);
}
