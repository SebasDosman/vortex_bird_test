package co.com.vortex.films.domain.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(name = "purchases")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "purchase_date", nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime purchaseDate;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseDetail> details = new ArrayList<>();

    @PrePersist
    private void onCreate() {
        this.purchaseDate = LocalDateTime.now();
        this.paymentStatus = PaymentStatus.COMPLETED;
    }

    public void addDetail(PurchaseDetail detail) {
        if (details == null) details = new ArrayList<>();

        details.add(detail);
        detail.setPurchase(this);
    }

    public void removeDetail(PurchaseDetail detail) {
        if (details != null) {
            details.remove(detail);
            detail.setPurchase(null);
        }
    }
}
