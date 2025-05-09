package co.com.vortex.films.application.repository;

import co.com.vortex.films.domain.models.PurchaseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseDetailRepository extends JpaRepository<PurchaseDetail, Long> {
}
