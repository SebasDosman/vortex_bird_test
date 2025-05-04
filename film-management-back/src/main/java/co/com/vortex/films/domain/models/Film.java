package co.com.vortex.films.domain.models;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Builder
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(name = "films")
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private FilmGenre genre;

    @Column(nullable = false)
    private FilmClassification classification;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private Integer ticketPrice;

    @Column(nullable = false)
    private boolean enabled;

    @PrePersist
    public void onCreate () {
        this.enabled = true;
    }
}
