package co.com.vortex.films.application.service.implementation;

import co.com.vortex.films.application.repository.FilmRepository;
import co.com.vortex.films.application.repository.PurchaseDetailRepository;
import co.com.vortex.films.application.service.IPurchaseDetailService;
import co.com.vortex.films.domain.dto.purchasedetail.PurchaseDetailResponse;
import co.com.vortex.films.domain.mappers.PurchaseDetailMapper;
import co.com.vortex.films.domain.validators.PurchaseDetailValidator;
import co.com.vortex.films.infrastructure.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class PurchaseDetailService implements IPurchaseDetailService {
    private final PurchaseDetailRepository purchaseDetailRepository;

    @Override
    @Transactional(readOnly = true)
    public Slice<PurchaseDetailResponse> findAll(Pageable pageable) {
        return PurchaseDetailMapper.toPurchaseDetailResponseSlice(purchaseDetailRepository.findAll(pageable));
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseDetailResponse findById(Long id) {
        if (!purchaseDetailRepository.existsById(id)) throw new NotFoundException(String.format(PurchaseDetailValidator.PURCHASE_DETAIL_NOT_FOUND, id));

        return PurchaseDetailMapper.toPurchaseDetailResponse(purchaseDetailRepository.getReferenceById(id));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!purchaseDetailRepository.existsById(id)) throw new NotFoundException(String.format(PurchaseDetailValidator.PURCHASE_DETAIL_NOT_FOUND, id));

        purchaseDetailRepository.deleteById(id);
    }
}
