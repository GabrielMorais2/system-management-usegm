package br.com.system.usegm.domain.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String reference;
    private int quantity;
    @Column(columnDefinition = "TEXT")
    private String image;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;
}
