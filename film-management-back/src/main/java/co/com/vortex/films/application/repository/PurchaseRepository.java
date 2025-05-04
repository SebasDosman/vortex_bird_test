package co.com.vortex.films.application.repository;

import co.com.vortex.films.domain.models.Purchase;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Slice<Purchase> findByUserId(Long id, Pageable pageable);
}
